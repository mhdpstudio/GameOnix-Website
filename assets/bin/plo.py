import os
from PIL import Image

# 🔹 قائمة المسارات
input_folders = [
    r"E:\Program\Projects\Xhyper\assets\images\games\posters",
    r"E:\Program\Projects\Xhyper\assets\images\games\logos",
    r"E:\Program\Projects\Xhyper\assets\images\games\banners",
    r"E:\Program\Projects\Xhyper\assets\videos\pics\webp",
    r"E:\Program\Projects\Xhyper\assets\images\games\ps\banners",
    r"E:\Program\Projects\Xhyper\assets\images\games\ps\logos",
    r"E:\Program\Projects\Xhyper\assets\images\games\ps\posters",
    r"E:\Program\Projects\Xhyper\assets\images\recharge\icons",
    r"E:\Program\Projects\Xhyper\assets\images\recharge\images",
    r"E:\Program\Projects\Xhyper\assets\images\recharge\images\free_fire",
    r"E:\Program\Projects\Xhyper\assets\images\recharge\images\steam_gift_cards",
    r"E:\Program\Projects\Xhyper\assets\images\recharge\images\slider",
    r"E:\Program\Projects\Xhyper\assets\images\apps",
    r"E:\Program\Projects\Xhyper\assets\images"
]

# إزالة limit التحذيري للصور الكبيرة
Image.MAX_IMAGE_PIXELS = None

MAX_DIMENSION = 16383

for input_folder in input_folders:
    print(f"\n📂 Processing folder: {input_folder}")

    if not os.path.exists(input_folder):
        print(f"⚠ Folder not found: {input_folder}")
        continue

    for filename in os.listdir(input_folder):
        if filename.lower().endswith((".png", ".jpg", ".jpeg")):
            input_path = os.path.join(input_folder, filename)

            # اسم الملف الجديد
            new_name = os.path.splitext(filename)[0] + ".webp"
            output_path = os.path.join(input_folder, new_name)

            # ⛔ لو موجود بالفعل نتخطاه
            if os.path.exists(output_path):
                print(f"⏭ Skipped (already exists): {new_name}")
                continue

            try:
                img = Image.open(input_path)

                # التعامل مع الشفافية
                if img.mode in ("P", "RGBA"):
                    img = img.convert("RGBA")
                else:
                    img = img.convert("RGB")

                # تصغير الصور الكبيرة
                if img.width > MAX_DIMENSION or img.height > MAX_DIMENSION:
                    img.thumbnail((MAX_DIMENSION, MAX_DIMENSION))

                # حفظ WebP
                if img.mode == "RGBA":
                    img.save(output_path, "webp", quality=80, lossless=True, method=6)
                else:
                    img.save(output_path, "webp", quality=80, method=6)

                print(f"✔ Converted: {filename} → {new_name}")

            except Exception as e:
                print(f"❌ Error with {filename}: {e}")

print("\n🔥 All folders done!")