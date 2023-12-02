import { useEffect } from "react";

export function usePopupClose(isOpen, closeAllPopups) {
    useEffect(() => {
        if (!isOpen) return;

        function handleOverlay(event) {
            if (event.target.classList.contains('popup')) {
                closeAllPopups();
            }
        }

        function handleEsc(e) {
            if (e.key === "Escape") {
                closeAllPopups();
            }
        }

        document.addEventListener('keydown', handleEsc);
        document.addEventListener('click', handleOverlay);

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.removeEventListener('click', handleOverlay);
        }
    }, [isOpen, closeAllPopups]);
}