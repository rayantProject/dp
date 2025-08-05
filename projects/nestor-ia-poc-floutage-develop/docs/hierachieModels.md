# Hiérarchie des Modèles YOLO

Ce document explique la hiérarchie des modèles YOLO, leurs différences en termes de performances, tailles et cas d'usage.

---

## 📊 Récapitulatif des modèles YOLO (`n`, `s`, `m`, `l`, `x`)

| Modèle         | Paramètres | Taille approx. | Vitesse (FPS)                 | Précision (mAP) | Usage recommandé                       |
| -------------- | ---------- | -------------- | ----------------------------- | --------------- | -------------------------------------- |
| `n` _(nano)_   | ~1.9M      | ~4-7 MB        | 🚀 Très rapide (~100+ FPS)    | 🔍 Faible       | Mobile, temps réel contraint, embarqué |
| `s` _(small)_  | ~7.5M      | ~15-20 MB      | ⚡ Rapide (~60-90 FPS)        | 🔍 Moyenne      | Webcams, stream temps réel             |
| `m` _(medium)_ | ~25M       | ~40-50 MB      | ⚖️ Bon équilibre (~30-45 FPS) | ✅ Bonne        | Usage général, edge devices            |
| `l` _(large)_  | ~50M       | ~80-100 MB     | 🐒 Plus lent (~20-30 FPS)     | ✅ Très bonne   | GPU desktop, batch                     |
| `x` _(xlarge)_ | ~90M+      | ~150-200 MB    | 🐼 Lente (~10-20 FPS)         | ✅ Excellente   | Serveur, cloud, haute précision        |

> ⚠ Ces chiffres sont **approximatifs** et varient selon la version de YOLO (v5, v8, v11...), le backend (PyTorch, ONNX, TensorRT) et le matériel (CPU, GPU, Jetson...).

---

## 🧠 Interprétation

- **`n` et `s`** sont conçus pour la **vitesse**, souvent au détriment de la précision.
- **`m`** est le **meilleur compromis** vitesse / précision / taille.
- **`l` et `x`** offrent la **meilleure précision**, mais demandent plus de ressources.

---

## 🧪 Benchmarks (exemple YOLOv5 sur COCO)

| Modèle  | mAP@0.5 | Latence (ms) | Taille fichier |
| ------- | ------- | ------------ | -------------- |
| YOLOv5n | ~28.0   | ~1.8         | 4.0 MB         |
| YOLOv5s | ~37.0   | ~2.4         | 14.0 MB        |
| YOLOv5m | ~45.0   | ~4.0         | 40.0 MB        |
| YOLOv5l | ~49.0   | ~6.0         | 90.0 MB        |
| YOLOv5x | ~51.5   | ~8.0         | 160.0 MB       |

---

Tu peux t’appuyer sur ces données pour choisir le modèle le plus adapté à ton projet.
