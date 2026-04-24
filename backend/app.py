from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware


# LangChain imports
from langchain_community.document_loaders import (
    PyMuPDFLoader,
    Docx2txtLoader,
    TextLoader
)
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.retrievers import BM25Retriever
from langchain_core.runnables import RunnableMap, RunnableLambda
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from sentence_transformers import CrossEncoder
from langchain.chat_models import init_chat_model

# -------------------- ENV --------------------
load_dotenv()
os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

# -------------------- APP --------------------
app = FastAPI()


app.add_middleware(

    CORSMiddleware,

    # allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # React dev server

    # allow_credentials=True,
    allow_origins=["*"], 

    allow_credentials=False, 

    allow_methods=["*"],

    allow_headers=["*"],

)

class Query(BaseModel):
    question: str

# -------------------- LOAD DATA --------------------
DATA_PATH = "data"

def load_documents():
    all_docs = []

    for file in os.listdir(DATA_PATH):
        file_path = os.path.join(DATA_PATH, file)

        try:
            if file.endswith(".pdf"):
                loader = PyMuPDFLoader(file_path)
            elif file.endswith(".docx"):
                loader = Docx2txtLoader(file_path)
            elif file.endswith(".txt"):
                loader = TextLoader(file_path)
            else:
                continue

            docs = loader.load()

            for doc in docs:
                doc.metadata["file_name"] = file
                doc.metadata["file_type"] = file.split(".")[-1]

            all_docs.extend(docs)

        except Exception as e:
            print(f"Error loading {file}: {e}")

    return all_docs

# -------------------- INIT PIPELINE (RUN ONCE) --------------------
def initialize_rag():

    docs = load_documents()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )
    chunks = splitter.split_documents(docs)

    # Embeddings
    embedding_model = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2"
    )

    vector_store = FAISS.from_documents(chunks, embedding_model)
    dense_retriever = vector_store.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 10}
    )

    # Sparse retriever
    sparse_retriever = BM25Retriever.from_documents(docs)
    sparse_retriever.k = 3

    # Hybrid retriever
    def hybrid_logic(query):
        dense_docs = dense_retriever.invoke(query)
        sparse_docs = sparse_retriever.invoke(query)

        combined = dense_docs + sparse_docs
        unique_docs = list({doc.page_content: doc for doc in combined}.values())
        return unique_docs

    hybrid_retriever = RunnableLambda(hybrid_logic)

    # Reranker
    reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

    def rerank_docs(query, docs, top_k=3):
        pairs = [(query, doc.page_content) for doc in docs]
        scores = reranker.predict(pairs)
        ranked = sorted(zip(docs, scores), key=lambda x: x[1], reverse=True)
        return [doc for doc, _ in ranked[:top_k]]

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    # LLM
    llm = init_chat_model("groq:llama-3.3-70b-versatile")

    # Query expansion
    query_prompt = PromptTemplate.from_template("""
    Expand the query with synonyms and technical context.

    Query: {query}
    """)
    query_expansion = query_prompt | llm | StrOutputParser()

    # Answer prompt
    answer_prompt = PromptTemplate.from_template("""
    Answer based on context.

    Context:
    {context}

    Question:
    {question}
    """)

    document_chain = answer_prompt | llm | StrOutputParser()

    # Final pipeline
    rag_pipeline = (
        RunnableMap({
            "question": lambda x: x["input"],
            "context": lambda x: format_docs(
                rerank_docs(
                    x["input"],
                    hybrid_retriever.invoke(
                        query_expansion.invoke({"query": x["input"]})
                    ),
                    top_k=3
                )
            )
        })
        | document_chain
    )

    return rag_pipeline


# Initialize once
rag_pipeline = initialize_rag()

# -------------------- API --------------------
@app.post("/ask")
def ask(q: Query):
    answer = rag_pipeline.invoke({"input": q.question})
    return {"answer": answer}