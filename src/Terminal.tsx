import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Screen, Banner, LogContainer, InputRow, PromptLabel, CmdInput, Cursor, Actions, Btn, Footer } from "./styles";
import { LogLine } from "./components/LogLine";
import { LANGS, type Lang, type StringKey } from "./i18n";
import { getAgeInfo, formatVersion, type AgeInfo } from "./age";

const GITHUB_URL = "#";
const LINKEDIN_URL = "#";

const CYCLE_MIN_MS = 15000;
const CYCLE_RANGE_MS = 5000;

interface BootLineDef {
  text?: string;
  cls?: string;
  key?: StringKey;
}

const BOOT_LINES: BootLineDef[] = [
  { text: "SYSTEM INIT ................ OK", cls: "dim" },
  { text: "LOADING KERNEL MODULES ..... OK", cls: "dim" },
  { text: "MOUNTING /dev/birthdate0 .... OK", cls: "dim" },
  { text: "NETWORK LINK ................ ESTABLISHED", cls: "dim" },
  { text: "" },
  { key: "greeting" },
  { key: "dob", cls: "dim" },
  { key: "age", cls: "dim" },
  { text: "" },
  { key: "eventHeader", cls: "accent" },
  { key: "treats" },
  { key: "allergen", cls: "warn" },
  { text: "" },
  { key: "helpHint" },
];

interface LogEntry {
  id: number;
  variant: "static" | "translatable" | "blank";
  text?: string;
  textKey?: StringKey;
  cls?: string;
  typewriter?: boolean;
}

export default function Terminal() {
  const [ageInfo] = useState<AgeInfo>(() => getAgeInfo());
  const [langIndex, setLangIndex] = useState(0);
  const lang: Lang = LANGS[langIndex];

  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [bootIndex, setBootIndex] = useState(0);
  const bootDone = bootIndex >= BOOT_LINES.length;
  const [inputRowVisible, setInputRowVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function pushEntry(entry: Omit<LogEntry, "id">) {
    const id = nextId.current++;
    setEntries((prev) => [...prev, { ...entry, id }]);
  }

  // reveal one boot line at a time
  useEffect(() => {
    if (bootDone) return;
    const line = BOOT_LINES[bootIndex];
    pushEntry({
      variant: line.key ? "translatable" : line.text === "" ? "blank" : "static",
      text: line.text,
      textKey: line.key,
      cls: line.cls,
      typewriter: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootIndex]);

  useEffect(() => {
    if (bootDone) {
      setInputRowVisible(true);
      inputRef.current?.focus();
    }
  }, [bootDone]);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [entries]);

  // auto-cycle the active language every 15-20s once boot has finished
  useEffect(() => {
    if (!bootDone) return;
    const delay = CYCLE_MIN_MS + Math.random() * CYCLE_RANGE_MS;
    const t = window.setTimeout(() => {
      setLangIndex((i) => (i + 1) % LANGS.length);
    }, delay);
    return () => window.clearTimeout(t);
  }, [bootDone, langIndex]);

  function appendEcho(cmdText: string) {
    pushEntry({ variant: "static", text: cmdText, cls: "prompt-echo" });
  }

  function appendTranslatable(key: StringKey, cls?: string) {
    pushEntry({ variant: "translatable", textKey: key, cls });
  }

  function appendStatic(text: string, cls?: string) {
    pushEntry({ variant: "static", text, cls });
  }

  function runCommand(raw: string) {
    const trimmed = raw.trim();
    appendEcho(raw);
    if (trimmed.length === 0) return;
    const name = trimmed.toLowerCase().split(/\s+/)[0];

    switch (name) {
      case "help":
        appendStatic("Available commands:");
        appendStatic("  help      show this list", "dim");
        appendStatic("  whoami    show identity info", "dim");
        appendStatic("  treats    show event / kitchen notice", "dim");
        appendStatic("  github    open GitHub profile", "dim");
        appendStatic("  linkedin  open LinkedIn profile", "dim");
        appendStatic("  clear     clear the terminal", "dim");
        appendStatic("  sudo      nice try", "dim");
        break;
      case "whoami":
        appendTranslatable("greeting");
        appendTranslatable("dob", "dim");
        appendTranslatable("age", "dim");
        break;
      case "treats":
        appendTranslatable("eventHeader", "accent");
        appendTranslatable("treats");
        appendTranslatable("allergen", "warn");
        break;
      case "github":
        appendStatic("Opening GitHub profile...", "dim");
        window.open(GITHUB_URL, "_blank", "noopener,noreferrer");
        break;
      case "linkedin":
        appendStatic("Opening LinkedIn profile...", "dim");
        window.open(LINKEDIN_URL, "_blank", "noopener,noreferrer");
        break;
      case "clear":
        setEntries([]);
        break;
      case "sudo":
        appendStatic("Permission denied: guest is not in the sudoers file.", "err");
        appendStatic("This incident will be reported.", "dim");
        break;
      default:
        appendStatic(`command not found: ${name} — type 'help'`, "err");
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const val = inputValue;
      setInputValue("");
      runCommand(val);
    }
  }

  function handleActionClick(cmd: string) {
    inputRef.current?.focus();
    runCommand(cmd);
  }

  return (
    <Screen onClick={() => inputRef.current?.focus()}>
      <Banner>
        {"=== B I R T H D A T E ===\n      TERMINAL v"}
        {formatVersion(ageInfo)}
      </Banner>

      <LogContainer>
        {entries.map((entry) => (
          <LogLine
            key={entry.id}
            cls={entry.cls}
            variant={entry.variant}
            text={entry.text}
            textKey={entry.textKey}
            typewriter={entry.typewriter}
            lang={lang}
            ageInfo={ageInfo}
            onTypeDone={entry.typewriter ? () => setBootIndex((i) => i + 1) : undefined}
          />
        ))}
      </LogContainer>

      <InputRow $visible={inputRowVisible}>
        <PromptLabel>guest@birthdate:~$</PromptLabel>
        <CmdInput
          ref={inputRef}
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Cursor />
      </InputRow>

      <Actions>
        <Btn onClick={() => handleActionClick("help")}>Help</Btn>
        <Btn onClick={() => handleActionClick("whoami")}>Whoami</Btn>
        <Btn onClick={() => handleActionClick("treats")}>Treats</Btn>
        <Btn onClick={() => handleActionClick("github")}>GitHub</Btn>
        <Btn onClick={() => handleActionClick("linkedin")}>LinkedIn</Btn>
        <Btn onClick={() => handleActionClick("clear")}>Clear</Btn>
      </Actions>

      <Footer>SESSION ESTABLISHED :: PRESS KEYS TO INTERACT</Footer>
    </Screen>
  );
}
