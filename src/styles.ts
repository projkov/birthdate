import styled, { createGlobalStyle, css, keyframes } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    /* spacemacs-theme (dark) palette */
    --bg: #292b2e;
    --fg: #4f97d7; /* keyword blue */
    --fg-dim: #686868; /* base-dim */
    --accent: #2d9574; /* comment/string green */
    --func: #bc6ec5; /* func magenta */
    --warn: #dc752f; /* war orange */
    --err: #e0211d; /* err red */
    --glow: 0 0 2px rgba(79, 151, 215, 0.8), 0 0 6px rgba(79, 151, 215, 0.4);
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    background: var(--bg);
    color: var(--fg);
    font-family: "Courier New", Monaco, monospace;
    height: 100%;
    overflow-x: hidden;
  }

  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 16px;
    position: relative;
  }

  body::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0px,
      rgba(0, 0, 0, 0.15) 1px,
      rgba(0, 0, 0, 0) 2px
    );
    z-index: 2;
    mix-blend-mode: multiply;
  }

  body::after {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.55) 100%);
    z-index: 3;
  }

  @media (max-width: 480px) {
    body {
      padding: 10px;
    }
  }
`;

const glitchFlicker = keyframes`
  0% { opacity: 1; transform: translateX(0); }
  25% { opacity: 0.55; transform: translateX(-2px); }
  50% { opacity: 1; transform: translateX(2px); }
  75% { opacity: 0.6; transform: translateX(-1px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

export const Screen = styled.div`
  flex: 1;
  max-width: 820px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
`;

export const Banner = styled.pre`
  color: var(--fg);
  text-shadow: var(--glow);
  font-size: clamp(8px, 2.4vw, 14px);
  line-height: 1.15;
  margin: 0 0 12px 0;
  white-space: pre;
  overflow-x: auto;
`;

export const LogContainer = styled.div`
  flex: 1;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 14px;
  line-height: 1.55;
  text-shadow: var(--glow);
  padding-bottom: 8px;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const Line = styled.div<{ $cls?: string; $glitching?: boolean }>`
  margin: 0 0 2px 0;

  ${(p) =>
    p.$cls === "dim" &&
    `
    color: var(--fg-dim);
    text-shadow: none;
  `}

  ${(p) =>
    p.$cls === "accent" &&
    `
    color: var(--accent);
    text-shadow: 0 0 4px rgba(45, 149, 116, 0.6);
  `}

  ${(p) =>
    p.$cls === "warn" &&
    `
    color: var(--warn);
    font-weight: bold;
    text-shadow: 0 0 4px rgba(220, 117, 47, 0.5);
  `}

  ${(p) =>
    p.$cls === "err" &&
    `
    color: var(--err);
    font-weight: bold;
    text-shadow: 0 0 4px rgba(224, 33, 29, 0.6);
  `}

  ${(p) =>
    p.$cls === "prompt-echo" &&
    `
    &::before {
      content: "guest@birthdate:~$ ";
      color: var(--accent);
    }
  `}

  ${(p) =>
    p.$glitching &&
    css`
      animation: ${glitchFlicker} 0.12s steps(2, end) infinite;
    `}
`;

export const InputRow = styled.div<{ $visible: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  padding: 6px 0 4px 0;
  border-top: 1px solid rgba(79, 151, 215, 0.15);
  margin-top: 6px;
  visibility: ${(p) => (p.$visible ? "visible" : "hidden")};

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const PromptLabel = styled.span`
  color: var(--accent);
  text-shadow: 0 0 4px rgba(0, 136, 51, 0.6);
  white-space: nowrap;
`;

export const CmdInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--fg);
  font-family: inherit;
  font-size: inherit;
  text-shadow: var(--glow);
  caret-color: transparent;
`;

export const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 16px;
  background: var(--fg);
  box-shadow: var(--glow);
  margin-left: 2px;
  animation: ${blink} 1s steps(1) infinite;
  vertical-align: middle;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
`;

export const Btn = styled.button`
  background: transparent;
  border: 1px solid var(--fg-dim);
  color: var(--fg);
  font-family: inherit;
  font-size: 12px;
  padding: 8px 12px;
  cursor: pointer;
  text-shadow: var(--glow);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover,
  &:focus {
    border-color: var(--func);
    background: rgba(188, 110, 197, 0.1);
  }

  &:active {
    background: rgba(188, 110, 197, 0.2);
  }

  @media (max-width: 480px) {
    flex: 1 1 calc(50% - 4px);
    text-align: center;
  }
`;

export const Footer = styled.footer`
  text-align: center;
  font-size: 10px;
  color: var(--fg-dim);
  margin-top: 16px;
  letter-spacing: 0.05em;
`;
