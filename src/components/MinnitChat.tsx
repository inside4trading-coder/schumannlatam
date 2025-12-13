import { useEffect, useRef } from "react";

export const MinnitChat = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create the span element
    const span = document.createElement("span");
    span.className = "minnit-chat-sembed";
    span.setAttribute("data-chatname", "https://organizations.minnit.chat/744699308636047/c/Main?embed");
    span.setAttribute("data-style", "width:100%; height:500px; max-height:90vh;");
    span.setAttribute("data-version", "1.55");
    span.style.display = "none";
    span.textContent = "Chat";

    // Append span to container
    if (containerRef.current) {
      containerRef.current.appendChild(span);
    }

    // Create and append the script
    const script = document.createElement("script");
    script.src = "https://minnit.chat/js/embed.js?c=1758971289";
    script.defer = true;
    document.body.appendChild(script);

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      // Remove script if it exists
      const existingScript = document.querySelector('script[src*="minnit.chat/js/embed.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full" />;
};
