import os
from PIL import Image

# =========================
# 🔹 كل المسارات (عادي + recursive)
# =========================
input_folders = [
    {"path": r"E:\Program\Projects\Xhyper\assets\images\games\posters", "recursive": False},
    {"path": r"E:\Program\Projects\Xhyper\assets\images\games\logos", "recursive": False},
    {"path": r"E:\Program\Projects\Xhyper\assets\images\games\banners", "recursive": False},
    {"path": r"E:\Program\Projects\Xhyper\assets\videos\pics\webp", "recursive": False},
    {"path": r"E:\Program\Projects\Xhyper\assets\images\games\ps\banners", "recursive": False},
    {"path": r"E:\Program\Projects\Xhyper\assets\images\games\ps\logos", "recursive": False},
    {"path": r"E:\Program\Projects\Xhyper\assets\images\games\ps\posters", "recursive": False},
    {"path": r"E:\Program\Projects\Xhyper\assets\images\recharge\icons", "recursive": False},
    {"path": r"E:\Program\Projects\Xhyper\assets\images\recharge\images", "recursive": True},
    {"path": r"E:\Program\Projects\Xhyper\assets\images\apps", "recursive": False},

    # 🖥️ Computer

    {"path": r"C:\Projects\Xhyper\assets\images\games\posters", "recursive": False},
    {"path": r"C:\Projects\Xhyper\assets\images\games\logos", "recursive": False},
    {"path": r"C:\Projects\Xhyper\assets\images\games\banners", "recursive": False},
    {"path": r"C:\Projects\Xhyper\assets\videos\pics\webp", "recursive": False},
    {"path": r"C:\Projects\Xhyper\assets\images\games\ps\banners", "recursive": False},
    {"path": r"C:\Projects\Xhyper\assets\images\games\ps\logos", "recursive": False},
    {"path": r"C:\Projects\Xhyper\assets\images\games\ps\posters", "recursive": False},
    {"path": r"C:\Projects\Xhyper\assets\images\recharge\icons", "recursive": False},
    {"path": r"C:\Projects\Xhyper\assets\images\recharge\images", "recursive": True},
    {"path": r"C:\Projects\Xhyper\assets\images\apps", "recursive": False},
    {"path": r"C:\Projects\Xhyper\assets\images\unities", "recursive": False},

]

# إزالة limit التحذيري للصور الكبيرة
Image.MAX_IMAGE_PIXELS = None
MAX_DIMENSION = 16383


# =========================
# 🔥 دالة التحويل
# =========================
def convert_image(input_path):
    folder = os.path.dirname(input_path)
    filename = os.path.basename(input_path)

    new_name = os.path.splitext(filename)[0] + ".webp"
    output_path = os.path.join(folder, new_name)

    if os.path.exists(output_path):
        print(f"⏭ Skipped: {new_name}")
        return

    try:
        img = Image.open(input_path)

        # الشفافية
        if img.mode in ("P", "RGBA"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")

        # تصغير لو كبير
        if img.width > MAX_DIMENSION or img.height > MAX_DIMENSION:
            img.thumbnail((MAX_DIMENSION, MAX_DIMENSION))

        # حفظ
        if img.mode == "RGBA":
            img.save(output_path, "webp", quality=80, lossless=True, method=6)
        else:
            img.save(output_path, "webp", quality=80, method=6)

        print(f"✔ Converted: {filename} → {new_name}")

    except Exception as e:
        print(f"❌ Error with {filename}: {e}")


# =========================
# 🔄 التشغيل
# =========================
for item in input_folders:
    folder = item["path"]
    recursive = item["recursive"]

    print(f"\n📂 Processing: {folder} (recursive={recursive})")

    if not os.path.exists(folder):
        print(f"⚠ Folder not found")
        continue

    # 🔹 لو recursive
    if recursive:
        for root, dirs, files in os.walk(folder):
            for filename in files:
                if filename.lower().endswith((".png", ".jpg", ".jpeg", ".ico")):
                    convert_image(os.path.join(root, filename))

    # 🔹 لو عادي
    else:
        for filename in os.listdir(folder):
            if filename.lower().endswith((".png", ".jpg", ".jpeg", ".ico")):
                convert_image(os.path.join(folder, filename))


print("\n🔥 All folders done!")