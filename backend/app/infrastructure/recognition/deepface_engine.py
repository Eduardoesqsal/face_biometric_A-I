from __future__ import annotations

from pathlib import Path


class DeepFaceRecognitionEngine:
    def __init__(self) -> None:
        self._deepface = None

    def verify(self, reference_image: Path, probe_image: Path) -> bool:
        try:
            if self._deepface is None:
                from deepface import DeepFace

                self._deepface = DeepFace

            result = self._deepface.verify(
                img1_path=str(reference_image),
                img2_path=str(probe_image),
                enforce_detection=False,
                detector_backend="opencv",
            )
            return bool(result.get("verified"))
        except AttributeError as error:
            raise RuntimeError(
                "TensorFlow no quedó instalado correctamente en este entorno. "
                "DeepFace depende de un módulo 'tensorflow' válido con atributo __version__. "
                "En tu caso Python está resolviendo un namespace package roto. "
                "Reinstala TensorFlow y DeepFace en el mismo entorno con:\n"
                "python -m pip uninstall -y tensorflow tensorflow-intel keras tf-keras deepface\n"
                "python -m pip install -r requirements.txt"
            ) from error
        except Exception as error:  # pragma: no cover - backend runtime guard
            raise RuntimeError(
                "El motor de reconocimiento no pudo procesar la imagen. "
                "Revisa que DeepFace y sus dependencias estén instalados correctamente."
            ) from error
