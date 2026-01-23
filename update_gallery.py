import os

# 1. Define the folder where images live
image_folder = "images/yacht"
extensions = {".jpg", ".jpeg", ".png", ".avif", ".webp"}

# 2. Find all images
image_tags = []
print(f"Scanning '{image_folder}' for photos...")

for root, dirs, files in os.walk(image_folder):
    for file in sorted(files):
        if any(file.lower().endswith(ext) for ext in extensions):
            # Create the relative path for the HTML
            full_path = os.path.join(root, file)
            # Fix path separators for web (just in case)
            web_path = full_path.replace("\\", "/")
            
            # Generate the HTML tag
            tag = f'                <img src="{web_path}" alt="Gallery Image">'
            image_tags.append(tag)
            print(f"Found: {file}")

print(f"Total images found: {len(image_tags)}")

# 3. Read the index.html file
with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# 4. Inject the new images into the gallery-grid
# We look for the marker <div class="gallery-grid"> and the closing </div>
start_marker = '<div class="gallery-grid">'
end_marker = '</div>'

start_index = content.find(start_marker)
# Find the *next* closing div after the start marker
end_index = content.find(end_marker, start_index)

if start_index != -1 and end_index != -1:
    # Construct the new HTML
    new_content = (
        content[:start_index + len(start_marker)] + "\n" +
        "\n".join(image_tags) + "\n" +
        "            " + content[end_index:]
    )
    
    # 5. Save the updated file
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("------------------------------------------------")
    print("SUCCESS! index.html has been updated with all photos.")
    print("------------------------------------------------")
else:
    print("ERROR: Could not find <div class='gallery-grid'> in index.html")
