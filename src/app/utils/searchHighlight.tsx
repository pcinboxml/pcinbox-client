import React from "react";

export function getSearchTokens(query: string): string[] {
  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((token) => token.length >= 2);
}

export function highlightMatch(
  text: string | undefined | null,
  query: string,
): React.ReactNode {
  if (!text) return null;

  const tokens = getSearchTokens(query);
  if (tokens.length === 0) return text;

  const pattern = tokens
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) => {
        const isMatch = tokens.some((token) =>
          part.toLowerCase().includes(token),
        );
        if (!isMatch) return <span key={index}>{part}</span>;
        return (
          <mark
            key={index}
            style={{
              backgroundColor: "#fef08a",
              color: "inherit",
              padding: "0 1px",
              borderRadius: 2,
            }}
          >
            {part}
          </mark>
        );
      })}
    </span>
  );
}
