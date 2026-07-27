export function updateBlockById(blocks, blockId, patch) {
  return blocks.map((block) =>
    block.id === blockId ? { ...block, ...patch } : block
  );
}

export function removeBlockById(blocks, blockId) {
  if (blocks.length <= 1) return blocks;
  return blocks.filter((block) => block.id !== blockId);
}

export function moveBlockById(blocks, blockId, direction) {
  const index = blocks.findIndex((block) => block.id === blockId);
  const nextIndex = index + direction;

  if (index < 0 || nextIndex < 0 || nextIndex >= blocks.length) {
    return blocks;
  }

  const next = [...blocks];
  const [target] = next.splice(index, 1);
  next.splice(nextIndex, 0, target);

  return next;
}

export function getPlainBodyFromBlocks(blocks = [], fallbackBody = "") {
  const text = blocks
    .filter((block) =>
      ["text", "heading", "quote", "highlight", "bullet", "callout"].includes(block.type)
    )
    .map((block) => block.value || "")
    .join("\n\n")
    .trim();

  return text || fallbackBody.trim();
}

export function isRenderableContentBlock(block) {
  if (!block || typeof block !== "object") return false;

  if (
    ["text", "heading", "quote", "highlight", "bullet", "callout"].includes(
      block.type
    )
  ) {
    return Boolean((block.value || "").trim());
  }

  if (block.type === "image") {
    return Boolean((block.url || "").trim());
  }

  if (block.type === "link") {
    return Boolean((block.text || "").trim() && (block.url || "").trim());
  }

  return Boolean((block.value || "").trim());
}

  export function getCleanContentBlocks(contentBlocks = []) {
  return contentBlocks
    .map((block) => {
      if (["text", "heading", "quote", "highlight", "bullet", "callout"].includes(block.type)) {
        return {
          type: block.type,
          value: (block.value || "").trim(),
          ...(block.fontFamily ? { fontFamily: block.fontFamily } : {}),
          ...(block.type === "bullet"
            ? { bulletStyle: block.bulletStyle || "dot" }
            : {}),
          ...(block.type === "callout"
            ? { calloutStyle: block.calloutStyle || "key" }
            : {}),
        };
      }

      if (block.type === "link") {
        return {
          type: "link",
          text: (block.text || "").trim(),
          url: (block.url || "").trim(),
        };
      }

      return {
        type: "image",
        url: block.url || "",
        caption: (block.caption || "").trim(),
        ...(block.alt?.trim() ? { alt: block.alt.trim() } : {}),
        ...(block.imageWidth && block.imageWidth !== "full"
          ? { imageWidth: block.imageWidth }
          : {}),
        ...(block.imageFit && block.imageFit !== "natural"
          ? { imageFit: block.imageFit }
          : {}),
        ...(block.captionAlign && block.captionAlign !== "center"
          ? { captionAlign: block.captionAlign }
          : {}),
      };
    })
    .filter((block) => {
      if (["text", "heading", "quote", "highlight", "bullet", "callout"].includes(block.type)) {
        return block.value;
      }

      if (block.type === "link") {
        return block.text && block.url;
      }

      return block.url;
    });
}

export function insertTextBlockAfter(blocks, blockId) {
  const index = blocks.findIndex((block) => block.id === blockId);

  const newBlock = {
    id: Date.now() + Math.random(),
    type: "text",
    value: "",
  };

  if (index < 0) {
    return [...blocks, newBlock];
  }

  const next = [...blocks];
  next.splice(index + 1, 0, newBlock);

  return next;
}

export function duplicateBlockById(blocks, blockId) {
  const index = blocks.findIndex((b) => b.id === blockId);

  if (index < 0) return blocks;

  const copied = {
    ...blocks[index],
    id: Date.now() + Math.random(),
  };

  const next = [...blocks];

  next.splice(index + 1, 0, copied);

  return next;
}
