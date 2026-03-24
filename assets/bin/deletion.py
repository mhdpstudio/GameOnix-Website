import os

# 🔹 نفس المسارات
folders = [
    r"E:\Program\Projects\Xhyper\assets\images\games\posters",
    r"E:\Program\Projects\Xhyper\assets\images\games\logos",
    r"E:\Program\Projects\Xhyper\assets\images\games\banners"
]

extensions_to_delete = (".png", ".jpg", ".jpeg")

for folder in folders:
    print(f"\n📂 Cleaning folder: {folder}")

    if not os.path.exists(folder):
        print(f"⚠ Folder not found: {folder}")
        continue

    for filename in os.listdir(folder):
        if filename.lower().endswith(extensions_to_delete):
            file_path = os.path.join(folder, filename)

            try:
                os.remove(file_path)
                print(f"🗑 Deleted: {filename}")
            except Exception as e:
                print(f"❌ Error deleting {filename}: {e}")

print("\n🔥 Cleanup done!")