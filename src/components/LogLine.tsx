import { useEffect, useRef, useState } from "react";
import { Line } from "../styles";
import { textForKey, type Lang, type StringKey } from "../i18n";
import type { AgeInfo } from "../age";

const GLITCH_CHARS = "!<>-_\\/[]{}=+*^#※▓▒░ЖШЩЙЦЪԾՁՊՌ";
const GLITCH_STEP_MS = 40;
const GLITCH_DURATION_MS = 320;
const TYPE_SPEED_MS = 8;

function scramble(length: number): string {
  const len = Math.max(length, 6);
  let out = "";
  for (let i = 0; i < len; i++) {
    out += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
  }
  return out;
}

export interface LogLineProps {
  cls?: string;
  variant: "static" | "translatable" | "blank";
  text?: string;
  textKey?: StringKey;
  typewriter?: boolean;
  lang: Lang;
  ageInfo: AgeInfo;
  onTypeDone?: () => void;
}

export function LogLine({ cls, variant, text, textKey, typewriter, lang, ageInfo, onTypeDone }: LogLineProps) {
  const fullText = variant === "translatable" && textKey ? textForKey(lang, textKey, ageInfo) : text ?? "";

  const [display, setDisplay] = useState(typewriter ? "" : fullText);
  const [glitching, setGlitching] = useState(false);
  const typedRef = useRef(!typewriter);
  const prevLangRef = useRef(lang);
  const onTypeDoneRef = useRef(onTypeDone);
  onTypeDoneRef.current = onTypeDone;

  // reveal the line one character at a time on mount (boot sequence lines only)
  useEffect(() => {
    if (!typewriter) return;
    if (fullText.length === 0) {
      typedRef.current = true;
      onTypeDoneRef.current?.();
      return;
    }
    let i = 0;
    const iv = window.setInterval(() => {
      i += 1;
      setDisplay(fullText.slice(0, i));
      if (i >= fullText.length) {
        window.clearInterval(iv);
        typedRef.current = true;
        onTypeDoneRef.current?.();
      }
    }, TYPE_SPEED_MS);
    return () => window.clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // scramble-then-reveal when the active language changes
  useEffect(() => {
    if (variant !== "translatable") return;
    if (prevLangRef.current === lang) return;
    prevLangRef.current = lang;
    if (!typedRef.current) {
      setDisplay(fullText);
      return;
    }
    setGlitching(true);
    const steps = Math.floor(GLITCH_DURATION_MS / GLITCH_STEP_MS);
    let i = 0;
    const iv = window.setInterval(() => {
      setDisplay(scramble(fullText.length));
      i += 1;
      if (i >= steps) {
        window.clearInterval(iv);
        setDisplay(fullText);
        setGlitching(false);
      }
    }, GLITCH_STEP_MS);
    return () => window.clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return <Line $cls={cls} $glitching={glitching}>{variant === "blank" ? " " : display}</Line>;
}
