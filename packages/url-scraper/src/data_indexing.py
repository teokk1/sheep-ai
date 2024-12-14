import os
import json
import csv
from openai import OpenAI

client = OpenAI(

)

vector_store_id = "vs_q86xekO1S5ePAoRtk4nkaunk"

# Define the directory containing the folders
base_dir = "data/www_gov_uk"

# Open a CSV file to write the results
with open("uploaded_files.csv", mode="w", newline="") as csv_file:
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow(["url_text", "url", "file_id"])

    for index, folder_name in enumerate(os.listdir(base_dir)):
        print(f"Uploading {index} / {len(os.listdir(base_dir))}")
        folder_path = os.path.join(base_dir, folder_name)

        try:
            if os.path.isdir(folder_path):
                content_file_path = os.path.join(folder_path, "content.txt")
                with open(content_file_path, "rb") as content_file:
                    response = client.files.create(file=content_file, purpose="assistants")
                    file_id = response.id

                    metadata_file_path = os.path.join(folder_path, "metadata.json")
                    with open(metadata_file_path, "r") as metadata_file:
                        metadata = json.load(metadata_file)
                        url_text = metadata.get("url_text", "")
                        url = metadata.get("url", "")

                    csv_writer.writerow([url_text, url, file_id])
        except Exception as e:
            print(f"Error uploading {folder_name}: {e}")
