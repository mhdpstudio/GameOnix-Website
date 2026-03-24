import os
from PIL import Image

input_folder = r"E:\Program\Projects\Xhyper\assets\videos\pics\Logo"

# إزالة limit التحذيري للصور الكبيرة
Image.MAX_IMAGE_PIXELS = None

MAX_DIMENSION = 16383

for filename in os.listdir(input_folder):
    if filename.lower().endswith((".png", ".jpg", ".jpeg")):
        input_path = os.path.join(input_folder, filename)

        # اسم الملف الجديد في نفس الفولدر
        new_name = os.path.splitext(filename)[0] + ".webp"
        output_path = os.path.join(input_folder, new_name)

        # ⛔ لو ملف webp موجود بالفعل نتخطاه
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

            # تصغير الصور الكبيرة لو تعدت الحد
            if img.width > MAX_DIMENSION or img.height > MAX_DIMENSION:
                img.thumbnail((MAX_DIMENSION, MAX_DIMENSION))

            # حفظ WebP مع الحفاظ على الشفافية
            if img.mode == "RGBA":
                img.save(output_path, "webp", quality=80, lossless=True, method=6)
            else:
                img.save(output_path, "webp", quality=80, method=6)

            print(f"✔ Converted: {filename} → {new_name}")

        except Exception as e:
            print(f"❌ Error with {filename}: {e}")

print("🔥 Done!")