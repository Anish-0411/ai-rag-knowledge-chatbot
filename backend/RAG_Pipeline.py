# %%
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import UnstructuredFileLoader
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.runnables import RunnableMap
from langchain_community.document_loaders import PyMuPDFLoader

# %%
#Step-1 : Preprocess 
#Loading and splitting into chunks using TextLoader and RecursiveCharacterTextSplitter

#Haven't Worked - Needs installation of lot of dependencies
# loader = UnstructuredFileLoader('Dictionary_Based_Disambiguation.pdf')
# raw_docs = loader.load()

import os
from langchain_community.document_loaders import PyMuPDFLoader
loader = PyMuPDFLoader("UNIT-1-Notes.pdf")
raw_docs = loader.load()


loader = TextLoader('langchain_crewai_dataset.txt')
raw_docs = loader.load()
raw_docs

splitter = RecursiveCharacterTextSplitter(chunk_size=300,chunk_overlap=100)
chunks = splitter.split_documents(raw_docs)

chunks


# %%
# 🔹 MULTI-DOCUMENT + MULTI-FORMAT LOADING + CHUNKING

import os
from langchain_community.document_loaders import (
    PyMuPDFLoader,
    Docx2txtLoader,
    TextLoader
)
from langchain_text_splitters import RecursiveCharacterTextSplitter

DATA_PATH = "data"

all_docs = []

# Here data is a folder and contains all the files of different kind 
# for-loop below is used to join path from directory to each file.
# for each file metadata is getting added 

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

        # each file is converted to Documents - paras:.docx, pages:.pdf, singleFile:.txt
        docs = loader.load() # contains Documents of each file 


        # metadata for citations (mandatory for citation creations)
        for doc in docs:
            doc.metadata["file_name"] = file
            doc.metadata["file_type"] = file.split(".")[-1]

        all_docs.extend(docs) 

    except Exception as e:
        print(f"❌ Error loading {file}: {e}")

print(f"✅ Loaded {len(all_docs)} documents")


# Split into chunks
# each Documents is converted to chunks - Now Uniform format
# page-> chunked pages, paras->chunked paras , full text->chunked text

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)

chunks = splitter.split_documents(all_docs)
print(f"✅ Total chunks created: {len(chunks)}")


# Preview
print("\n🔍 Sample chunk:")
print(chunks[0].page_content[:300])
print("\n📌 Metadata:", chunks[0].metadata)

# %%
# Step-2 : Embedding and Retriving using *** (MMR - Relevence + Diversity) ***
#Embed the chunks and store in vector store
#Taking FAISS Vector Store

# Model Comparision
# all-mpnet-base-v2 - higher accuracy
# bge-base-en - best retrieval
# e5-large-v2 - advanced RAG
embedding_model = HuggingFaceEmbeddings(model_name='all-MiniLM-L6-v2')
embedding_model

vector_store = FAISS.from_documents(chunks,embedding_model)

#Retrive them as retriver (always)
retriver = vector_store.as_retriever(search_type='mmr',kwargs={"k":10})
retriver

# %%
# Hybrid Search 
### Sparse Retriever(BM25)
# from langchain_community.retrievers import BM25Retriever
# from langchain_community.retrievers import EnsembleRetriever
# from langchain.retrievers import EnsembleRetriever

# sparse_retriever=BM25Retriever.from_documents(docs)
# sparse_retriever.k=3 ##top- k documents to retriever


# ### Combine with Ensemble Retriever
# hybrid_retriever=EnsembleRetriever(
#     retrievers=[dense_retriever,sparse_retriever],
#     weight=[0.7,0.3]
# )

from langchain_community.retrievers import BM25Retriever

# Sparse
sparse_retriever = BM25Retriever.from_documents(docs)
sparse_retriever.k = 3

# Dense
dense_retriever = retriver  # your FAISS retriever

from langchain_core.runnables import RunnableLambda

def hybrid_logic(query):
    dense_docs = dense_retriever.invoke(query)
    sparse_docs = sparse_retriever.invoke(query)

    combined = dense_docs + sparse_docs

    # remove duplicates
    unique_docs = list({doc.page_content: doc for doc in combined}.values())

    return unique_docs

# 🔥 This behaves like a retriever
hybrid_retriever = RunnableLambda(hybrid_logic)

# %%
from sentence_transformers import CrossEncoder

# 🔥 Reranker model (fast + good)
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

def rerank_docs(query, docs, top_k=3):
    # Create (query, doc) pairs
    pairs = [(query, doc.page_content) for doc in docs]

    # Get relevance scores
    scores = reranker.predict(pairs)

    # Attach scores to docs
    scored_docs = list(zip(docs, scores))

    # Sort by score (highest first)
    ranked_docs = sorted(scored_docs, key=lambda x: x[1], reverse=True)

    # Return top_k documents
    return [doc for doc, _ in ranked_docs[:top_k]]

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)



# %%
# Step-3 : LLM and Prompt
import os
from dotenv import load_dotenv
load_dotenv()
from langchain.chat_models import init_chat_model

#load env details (API Key)
os.environ['GROQ_API_KEY'] = os.getenv("GROQ_API_KEY")

#Initiate LLM 
llm = init_chat_model("groq:llama-3.3-70b-versatile")
llm

# %%
# *** Query Expansion ***
# Step-4 
query_expansion_prompt = PromptTemplate.from_template("""
You are a helpful assistant. Expand the following query to improve document retrieval by adding relevant synonyms, technical terms, and useful context.

Original query: "{query}"

Expanded query:
""")

query_expansion_chain=query_expansion_prompt| llm | StrOutputParser()
query_expansion_chain

# %%
query_expansion_chain.invoke({"query":"What is Dictionary based disambigution"})

# %%
answer_prompt = PromptTemplate.from_template(
    """
        Answer the question based on the below given context,

        Context:{context}

        Question:{question}
    """
)


from langchain_core.output_parsers import StrOutputParser
document_chain = (
    answer_prompt
    | llm
    | StrOutputParser()
)

# %%
# rag_pipeline = (
#     RunnableMap({
#         "question": lambda x: x["input"],
#         "context": lambda x: retriver.invoke(
#             query_expansion_chain.invoke({"query": x["input"]})
#         )
#     })
#     | document_chain
# )

rag_pipeline = (
    RunnableMap({
        "question": lambda x: x["input"],

        "context": lambda x: format_docs(
            rerank_docs(
                x["input"],   # original query
                hybrid_retriever.invoke(
                    query_expansion_chain.invoke({"query": x["input"]})
                ),
                top_k=3   # 🔥 final selected docs
            )
        )
    })
    | document_chain
)

# %%
query = {"input": "what are stages in waterfall model?"}

print("🔍 Expanded Query:")
print(query_expansion_chain.invoke({"query": query["input"]}))
response = rag_pipeline.invoke(query)
print("\n✅ Answer:\n", response)


