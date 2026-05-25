"use client";

import { useEffect } from "react";

interface ScriptInjectorProps {
  headScripts: string;
  bodyScripts: string;
}

/**
 * Client component that injects custom scripts into head and body
 * Used in public layout to avoid making root layout async
 */
export function ScriptInjector({ headScripts, bodyScripts }: ScriptInjectorProps) {
  useEffect(() => {
    // Inject head scripts
    if (headScripts && headScripts.trim()) {
      const headContainer = document.createElement("div");
      headContainer.innerHTML = headScripts;
      
      // Move all child elements to document.head
      while (headContainer.firstChild) {
        const node = headContainer.firstChild;
        if (node instanceof Element && !document.head.querySelector(`[data-injected="true"]`)) {
          node.setAttribute("data-injected", "true");
        }
        document.head.appendChild(node);
      }
    }

    // Inject body scripts
    if (bodyScripts && bodyScripts.trim()) {
      const bodyContainer = document.createElement("div");
      bodyContainer.innerHTML = bodyScripts;
      
      // Move all child elements to end of document.body
      while (bodyContainer.firstChild) {
        const node = bodyContainer.firstChild;
        if (node instanceof Element && !node.hasAttribute("data-injected")) {
          node.setAttribute("data-injected", "true");
        }
        document.body.appendChild(node);
      }
    }
  }, [headScripts, bodyScripts]);

  // This component doesn't render anything visible
  return null;
}
