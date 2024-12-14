import os
import json
import csv
from openai import OpenAI

client = OpenAI(
    api_key=""
)

vector_store_id = "vs_q86xekO1S5ePAoRtk4nkaunk"

# read uploaded_files.csv and take file_ids
with open("uploaded_files.csv", mode="r", newline="") as csv_file:
    csv_reader = csv.reader(csv_file)
    next(csv_reader)  # skip header
    file_ids = [row[2] for row in csv_reader]

vector_store_file_batch = client.beta.vector_stores.file_batches.create(
    vector_store_id=vector_store_id,
    file_ids=file_ids,
)
print(vector_store_file_batch)
