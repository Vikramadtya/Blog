---
id: 136cd846-c9e6-4b40-9b19-7c2a68ed29da
tags:
---
# RoadMap

# Core Books

1. ML: Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow — Aurélien Géron.
2. LLM: Build a Large Language Model (From Scratch) — Sebastian Raschka.
3. MLOps: Designing Machine Learning Systems — Chip Huyen.

---

# PHASE 1: Machine Learning Foundations

**Days 1–30**

## Week 1: Python, NumPy and Pandas

| Day | Topic | Exercise | Resource |
|---|---|---|---|
| 1 | ML overview: supervised, unsupervised and reinforcement learning | Identify 5 real-world ML problems and classify them | Géron: Introduction; Google ML Crash Course |
| 2 | Python for ML: lists, dictionaries, functions | Write functions to clean and transform a dataset | Kaggle Python |
| 3 | NumPy: arrays, dimensions, broadcasting | Implement vector addition, matrix multiplication and normalization | NumPy Quickstart |
| 4 | Pandas: Series, DataFrames, filtering and grouping | Load a CSV and perform 10 data manipulation operations | Kaggle Pandas |
| 5 | Data cleaning: missing values, duplicates and outliers | Clean a real-world Kaggle dataset | Kaggle Pandas; Géron |
| 6 | Data visualization: histograms, scatter plots and correlations | Perform EDA on Titanic data | Kaggle Data Visualization |
| 7 | Weekly revision | Create one EDA notebook and publish it on GitHub | Revise Days 1–6 |

Resources:
- https://www.kaggle.com/learn/python
- https://www.kaggle.com/learn/pandas
- https://www.kaggle.com/learn/data-visualization
- https://numpy.org/doc/stable/user/quickstart.html
- https://developers.google.com/machine-learning/crash-course

## Week 2: Mathematics and Statistics for ML

| Day | Topic | Exercise | Resource |
|---|---|---|---|
| 8 | Linear algebra: vectors and matrices | Implement vector operations using NumPy | 3Blue1Brown Linear Algebra |
| 9 | Matrix multiplication and dot products | Implement dot products and matrix multiplication | NumPy Documentation |
| 10 | Probability: conditional probability and Bayes theorem | Solve 10 probability problems | StatQuest |
| 11 | Statistics: mean, median, variance and standard deviation | Calculate statistical summaries for a dataset | StatQuest |
| 12 | Distributions: normal, Bernoulli and binomial | Visualize three probability distributions | StatQuest |
| 13 | Calculus: derivatives and gradients | Implement numerical differentiation using Python | 3Blue1Brown Calculus |
| 14 | Optimization: gradient descent | Implement gradient descent for a simple function | Google ML Crash Course |

Resources:
- https://www.3blue1brown.com/topics/linear-algebra
- https://www.3blue1brown.com/topics/calculus
- https://statquest.org/
- https://developers.google.com/machine-learning/crash-course

## Week 3: Supervised Machine Learning

| Day | Topic | Exercise | Resource |
|---|---|---|---|
| 15 | ML workflow: features, labels, training and testing | Create your first train/test split | Géron: End-to-End ML Project |
| 16 | Linear regression | Implement linear regression with Scikit-learn | Géron; Kaggle Intro to ML |
| 17 | Loss functions: MSE and MAE | Calculate both losses and compare predictions | Google ML Crash Course |
| 18 | Logistic regression | Build a binary classification model | Géron: Logistic Regression |
| 19 | Classification metrics: accuracy, precision, recall and F1 | Generate a confusion matrix and calculate metrics | Google ML Crash Course |
| 20 | Overfitting, underfitting and regularization | Train models with different complexity and compare results | Géron |
| 21 | Weekly project | Build a Titanic survival prediction baseline | Kaggle Titanic Competition |

Resources:
- https://www.kaggle.com/learn/intro-to-machine-learning
- https://www.kaggle.com/competitions/titanic
- https://developers.google.com/machine-learning/crash-course

## Week 4: Advanced Classical ML

| Day | Topic | Exercise | Resource |
|---|---|---|---|
| 22 | Decision trees | Train a decision tree and visualize its decisions | Géron |
| 23 | Random forests | Compare random forest with a decision tree | Géron |
| 24 | Gradient boosting and XGBoost | Train an XGBoost model on a tabular dataset | XGBoost Documentation |
| 25 | Feature engineering | Create new features for Titanic dataset | Kaggle Feature Engineering |
| 26 | Cross-validation | Implement k-fold cross-validation | Géron |
| 27 | Hyperparameter tuning | Compare GridSearchCV and RandomizedSearchCV | Scikit-learn Documentation |
| 28 | Data leakage and pipelines | Build a preprocessing and training pipeline | Kaggle Intermediate ML |

Resources:
- https://xgboost.readthedocs.io/
- https://www.kaggle.com/learn/feature-engineering
- https://www.kaggle.com/learn/intermediate-machine-learning
- https://scikit-learn.org/stable/

## Days 29–30: Classical ML Project

| Day | Topic | Exercise | Resource |
|---|---|---|---|
| 29 | End-to-end ML project | Complete Titanic solution using three models, cross-validation and error analysis | Kaggle Titanic; Géron |
| 30 | Project documentation | Publish notebook with EDA, metrics, feature importance and README | GitHub |

### Phase 1 Deliverables

- One complete Kaggle competition.
- One polished GitHub ML notebook.
- Understanding of classical ML algorithms.
- Ability to explain model evaluation and overfitting.

---

# PHASE 2: Deep Learning and NLP

**Days 31–60**

## Week 5: Neural Network Fundamentals

| Day | Topic | Exercise | Resource |
|---|---|---|---|
| 31 | Introduction to neural networks | Draw a neural network and explain its layers | Géron |
| 32 | Perceptrons and activation functions | Implement sigmoid, ReLU and tanh using NumPy | 3Blue1Brown Neural Networks |
| 33 | Forward propagation | Implement forward propagation for a small network | Géron |
| 34 | Backpropagation | Understand and manually calculate gradients for a tiny network | 3Blue1Brown |
| 35 | Gradient descent and optimizers | Compare SGD and Adam | PyTorch Tutorials |
| 36 | Loss functions and regularization | Experiment with different losses and dropout | Géron |
| 37 | Weekly revision | Implement a small neural network using NumPy | Revision |

Resources:
- https://www.3blue1brown.com/topics/neural-networks
- https://pytorch.org/tutorials/

## Week 6: PyTorch

| Day | Topic | Exercise | Resource |
|---|---|---|---|
| 38 | PyTorch tensors | Create tensors and practice reshaping, slicing and broadcasting | PyTorch Basics |
| 39 | Autograd and computational graphs | Calculate gradients using PyTorch autograd | PyTorch Autograd |
| 40 | Building neural networks using nn.Module | Create a two-layer neural network | PyTorch Tutorials |
| 41 | Training loops | Implement forward pass, loss, backward pass and optimizer step | PyTorch Tutorials |
| 42 | Dataset and DataLoader | Load and batch a custom dataset | PyTorch Tutorials |
| 43 | GPU training and optimization | Train on GPU if available; compare CPU and GPU | PyTorch Tutorials |
| 44 | Deep learning mini-project | Build an MNIST digit classifier using PyTorch | PyTorch MNIST Example |

Resources:
- https://pytorch.org/tutorials/beginner/basics/intro.html
- https://pytorch.org/tutorials/

## Week 7: Deep Learning Architectures

| Day | Topic | Exercise | Resource |
|---|---|---|---|
| 45 | CNN fundamentals | Understand convolution, filters and pooling | Géron |
| 46 | CNN implementation | Build an image classifier using PyTorch | PyTorch Computer Vision |
| 47 | RNN and LSTM fundamentals | Draw an RNN architecture and understand sequential processing | Understanding LSTM Networks |
| 48 | NLP fundamentals | Clean text and build a preprocessing pipeline | Hugging Face NLP Course |
| 49 | Tokenization | Implement word-level and subword tokenization experiments | Hugging Face Tokenizers |
| 50 | Word embeddings | Generate embeddings and calculate cosine similarity | Sentence Transformers |
| 51 | Text classification project | Build a sentiment classifier using TF-IDF and logistic regression | Kaggle NLP datasets |

Resources:
- https://colah.github.io/posts/2015-08-Understanding-LSTMs/
- https://huggingface.co/learn/nlp-course/
- https://www.sbert.net/

## Week 8: Transformers and LLM Foundations

| Day | Topic | Exercise | Resource |
|---|---|---|---|
| 52 | Attention mechanism | Implement scaled dot-product attention in PyTorch | Raschka |
| 53 | Self-attention | Calculate query, key and value representations | Raschka |
| 54 | Multi-head attention | Implement a multi-head attention module | Raschka |
| 55 | Positional embeddings | Implement token and positional embeddings | Raschka |
| 56 | Transformer architecture | Draw and explain a Transformer block | Illustrated Transformer |
| 57 | GPT architecture | Understand decoder-only Transformer architecture | Raschka |
| 58 | Tokenization and language modeling | Explore BPE tokenization and next-token prediction | Hugging Face LLM Course |

Resources:
- https://jalammar.github.io/illustrated-transformer/
- https://huggingface.co/learn/llm-course/
- https://github.com/rasbt/LLMs-from-scratch

## Days 59–60: Deep Learning Project

| Day | Topic | Exercise | Resource |
|---|---|---|---|
| 59 | Fine-tuning pretrained models | Fine-tune DistilBERT for sentiment classification | Hugging Face Transformers |
| 60 | Model evaluation and publishing | Evaluate precision, recall and F1; publish model and model card | Hugging Face Model Hub |

### Phase 2 Deliverables

- A neural network implemented with PyTorch.
- An image classification exercise.
- A sentiment classification model.
- Understanding of attention and Transformer architecture.
- One model published on Hugging Face.

---

# PHASE 3: Generative AI, MLOps and Production Engineering

**Days 61–90**

## Week 9: LLM Engineering

| Day | Topic | Exercise | Resource |
|---|---|---|---|
| 61 | LLM fundamentals and inference | Understand pretraining, inference and next-token prediction | Raschka |
| 62 | Prompt engineering | Experiment with zero-shot, few-shot and structured prompts | Prompt Engineering Guide |
| 63 | Hugging Face Transformers pipeline | Load a pretrained model and perform inference | Transformers Documentation |
| 64 | Embeddings and semantic search | Generate sentence embeddings and retrieve similar sentences | Sentence Transformers |
| 65 | Vector databases | Build a semantic search system using FAISS | FAISS Documentation |
| 66 | Chunking and document preprocessing | Load PDFs, split documents and experiment with chunk sizes | LlamaIndex Documentation |
| 67 | Retrieval-Augmented Generation | Build a basic RAG pipeline using retrieved document chunks | Hugging Face; RAG Tutorials |

Resources:
- https://huggingface.co/docs/transformers/
- https://www.promptingguide.ai/
- https://www.sbert.net/
- https://github.com/facebookresearch/faiss
- https://docs.llamaindex.ai/

## Week 10: Advanced RAG and Fine-tuning

| Day | Topic | Exercise | Resource |
|---|---|---|---|
| 68 | RAG architecture | Draw complete ingestion and retrieval architecture | Chip Huyen; RAG documentation |
| 69 | Retrieval quality | Experiment with top-k retrieval and similarity thresholds | LlamaIndex |
| 70 | Reranking | Compare similarity search with a cross-encoder reranker | Sentence Transformers |
| 71 | RAG evaluation | Evaluate retrieval precision, recall and answer relevance | Ragas Documentation |
| 72 | Hallucination and grounded answers | Create 20 test questions and identify unsupported answers | Ragas; Hugging Face |
| 73 | Fine-tuning vs RAG | Compare when to use RAG, prompting and fine-tuning | Raschka; Hugging Face |
| 74 | LoRA and PEFT | Fine-tune a small pretrained model using parameter-efficient fine-tuning | PEFT Documentation |

Resources:
- https://docs.ragas.io/
- https://huggingface.co/docs/peft/
- https://docs.llamaindex.ai/

## Week 11: MLOps and Deployment

| Day | Topic | Exercise | Resource |
|---|---|---|---|
| 75 | ML lifecycle and production architecture | Draw a complete model development-to-production pipeline | Chip Huyen |
| 76 | Experiment tracking | Track model parameters and metrics using MLflow | MLflow Documentation |
| 77 | Model versioning | Save model artifacts and track model versions | MLflow Model Registry |
| 78 | FastAPI | Build an API endpoint that accepts input and returns model predictions | FastAPI Tutorial |
| 79 | Docker | Containerize your ML application | Docker Get Started |
| 80 | Model serving and inference | Serve your trained model through FastAPI and Docker | Chip Huyen |
| 81 | Monitoring and drift | Simulate changing input distributions and monitor model metrics | Chip Huyen |

Resources:
- https://mlflow.org/docs/latest/
- https://fastapi.tiangolo.com/tutorial/
- https://docs.docker.com/get-started/

## Week 12: Production RAG Project

| Day | Topic | Exercise | Resource |
|---|---|---|---|
| 82 | Project architecture | Design an end-to-end document question-answering application | Full Stack Deep Learning |
| 83 | Document ingestion | Upload and parse PDF documents | LlamaIndex |
| 84 | Embeddings and vector storage | Generate embeddings and store them in FAISS | Sentence Transformers; FAISS |
| 85 | Retrieval pipeline | Implement top-k retrieval and reranking | LlamaIndex; Sentence Transformers |
| 86 | LLM generation | Generate answers using retrieved context | Hugging Face or an LLM API |
| 87 | Evaluation and testing | Create a test dataset and evaluate retrieval and answer quality | Ragas |
| 88 | Deployment | Deploy your RAG application using FastAPI and Docker | FastAPI; Docker |

## Days 89–90: Final Review and Interview Preparation

| Day | Topic | Exercise | Resource |
|---|---|---|---|
| 89 | ML system design and interview preparation | Design a recommendation system and scalable RAG system; explain architecture and trade-offs | Chip Huyen; ML System Design |
| 90 | Portfolio and career readiness | Polish GitHub, READMEs, project architecture diagrams and resume; prepare project walkthroughs | GitHub |




