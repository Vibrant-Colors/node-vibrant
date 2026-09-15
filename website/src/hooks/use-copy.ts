import { useCallback, useEffect, useState } from "react";

const DEFAULT_RESET_DELAY = 1600;

async function copyText(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		// Fall through to legacy copy when Clipboard API is unavailable.
	}

	try {
		const textarea = document.createElement("textarea");
		textarea.value = text;
		textarea.setAttribute("readonly", "");
		textarea.style.position = "fixed";
		textarea.style.opacity = "0";
		textarea.style.pointerEvents = "none";
		document.body.appendChild(textarea);
		textarea.select();
		const success = document.execCommand("copy");
		document.body.removeChild(textarea);
		return success;
	} catch {
		return false;
	}
}

export function useCopy(resetDelay = DEFAULT_RESET_DELAY) {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timeoutId = window.setTimeout(() => setCopied(false), resetDelay);
		return () => window.clearTimeout(timeoutId);
	}, [copied, resetDelay]);

	const copy = useCallback(async (text: string) => {
		const success = await copyText(text);
		if (success) setCopied(true);
		return success;
	}, []);

	return { copied, copy };
}
