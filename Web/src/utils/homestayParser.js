/**
 * Utility functions to parse homestay data from AI chat responses
 */

/**
 * Check if a text contains homestay data structure
 */
export const containsHomestayData = (text) => {
  if (!text || typeof text !== "string") return false;

  // Look for patterns that indicate homestay data
  const patterns = [
    /dạ,?\s*có\s*\d+\s*homestay/i,
    /🏠|🏡|🏘️/,
    /📍|📌|🌍/,
    /💰|💵|💸/,
    /🛏️|🛌|🏨/,
    /🆔/,
    /🖼️|📸|🖥️/,
    /homestay/i,
  ];

  return patterns.some((pattern) => pattern.test(text));
};

/**
 * Extract homestay data from structured text
 */
export const parseHomestayFromText = (text) => {
  if (!text || typeof text !== "string") return null;

  try {
    // Try parsing as JSON first
    if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
      return JSON.parse(text);
    }

    // Parse emoji format - look for homestay block
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    const homestayData = {};

    for (const line of lines) {
      // Parse name (🏠 emoji)
      if (line.match(/🏠/)) {
        const nameMatch = line.match(/🏠\s*(.+)/);
        if (nameMatch) homestayData.name = nameMatch[1].trim();
      }
      // Parse location (📍 emoji)
      else if (line.match(/📍/)) {
        const locationMatch = line.match(/📍\s*(.+)/);
        if (locationMatch) homestayData.location = locationMatch[1].trim();
      }
      // Parse price (💰 emoji)
      else if (line.match(/💰/)) {
        const priceMatch = line.match(/💰\s*(?:Giá từ?:\s*)?(.+)/i);
        if (priceMatch) homestayData.price = priceMatch[1].trim();
      }
      // Parse image (🖼️ emoji)
      else if (line.match(/🖼️/)) {
        const imageMatch = line.match(/🖼️\s*(?:Hình ảnh:\s*)?(.+)/i);
        if (imageMatch) homestayData.image = imageMatch[1].trim();
      }
      // Parse ID (🆔 emoji)
      else if (line.match(/🆔/)) {
        const idMatch = line.match(/🆔\s*(?:ID:\s*)?(.+)/i);
        if (idMatch) homestayData.id = idMatch[1].trim();
      }
      // Parse rooms (🛏️ emoji)
      else if (line.match(/🛏️/)) {
        const roomMatch = line.match(/🛏️\s*(?:Phòng:\s*)?(.+)/i);
        if (roomMatch) {
          const roomsText = roomMatch[1].trim();

          // Smart split: tách theo pattern room code, không tách ở số tiền
          let roomStrings = [];
          if (roomsText.includes(",") && roomsText.includes(":")) {
            // Split by comma followed by room code pattern (letters-numbers:)
            roomStrings = roomsText
              .split(/,\s*(?=[A-Z]+-\d+:)/)
              .map((room) => room.trim());
          } else {
            roomStrings = [roomsText];
          }

          // Parse each room string into object
          homestayData.rooms = roomStrings.map((roomStr) => {
            // Format: "SR-154: 100,000 VNĐ/đêm (5 người)"
            const roomMatch = roomStr.match(
              /^([A-Z]+-\d+):\s*(.+?)\s*\((\d+)\s*người\)$/
            );
            if (roomMatch) {
              return {
                name: roomMatch[1],
                price: roomMatch[2].trim(),
                capacity: `${roomMatch[3]} người`,
              };
            } else {
              // Fallback nếu format không match
              return {
                name: roomStr.split(":")[0] || roomStr,
                price: roomStr.includes(":")
                  ? roomStr
                      .split(":")[1]
                      .replace(/\(\d+\s*người\)/, "")
                      .trim()
                  : "Liên hệ",
                capacity: "1 người",
              };
            }
          });
        }
      }
    }

    // Return homestay if it has basic info
    if (homestayData.name && (homestayData.location || homestayData.price)) {
      return homestayData;
    }

    return null;
  } catch (error) {
    console.error("Error parsing homestay data:", error);
    return null;
  }
};

/**
 * Extract multiple homestay objects from a text that might contain multiple homestays
 */
export const parseMultipleHomestaysFromText = (text) => {
  if (!text || typeof text !== "string") return [];

  try {
    // Try parsing as JSON array first
    if (text.trim().startsWith("[")) {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [parsed];
    }

    // Split by 🏠 emoji to separate homestays
    // Use lookahead to keep the emoji with each block
    const homestayBlocks = text.split(/(?=🏠)/);

    const homestays = [];
    for (const block of homestayBlocks) {
      if (block.trim() && block.includes("🏠")) {
        const parsed = parseHomestayFromText(block.trim());

        if (parsed) {
          homestays.push(parsed);
        }
      }
    }

    return homestays;
  } catch (error) {
    return [];
  }
};

/**
 * Format homestay data for display
 */
export const formatHomestayData = (homestay) => {
  if (!homestay || typeof homestay !== "object") return null;

  // Extract capacity from rooms if available
  let capacity = homestay.capacity || 1;
  if (homestay.rooms && homestay.rooms.length > 0) {
    // Rooms are now objects {name, price, capacity}
    const capacityMatches = homestay.rooms
      .map((room) => {
        if (typeof room === "object" && room.capacity) {
          // Extract number from "5 người" format
          const match = room.capacity.match(/(\d+)/);
          return match ? parseInt(match[1]) : 0;
        } else if (typeof room === "string") {
          // Fallback for string format "SR-154: 100,000 VNĐ/đêm (5 người)"
          const match = room.match(/\((\d+)\s*người\)/);
          return match ? parseInt(match[1]) : 0;
        }
        return 0;
      })
      .filter((num) => num > 0);

    if (capacityMatches.length > 0) {
      capacity = Math.max(...capacityMatches);
    }
  }

  return {
    id: homestay.id || Math.random().toString(36).substr(2, 9),
    name: homestay.name || "Homestay không tên",
    location: homestay.location || "Chưa có thông tin địa điểm",
    price: homestay.price || "Liên hệ để biết giá",
    rating: homestay.rating || 0,
    capacity: capacity,
    image: homestay.image || null,
    rooms: Array.isArray(homestay.rooms) ? homestay.rooms : [],
    amenities: Array.isArray(homestay.amenities) ? homestay.amenities : [],
    description: homestay.description || "",
  };
};

/**
 * Extract text content before homestay data (like "Dạ, có 2 homestay:")
 */
export const extractTextBeforeHomestays = (text) => {
  if (!text || typeof text !== "string") return "";

  // Find first 🏠 emoji
  const firstHomestayIndex = text.search(/🏠/);

  if (firstHomestayIndex === -1) return text;

  // Get text before first homestay
  const beforeText = text.substring(0, firstHomestayIndex).trim();

  // Clean up trailing colons and empty lines
  return beforeText
    .replace(/[:：]\s*$/, "")
    .replace(/\n+$/, "")
    .trim();
};

/**
 * Check if message content should be rendered as homestay cards
 */
export const shouldRenderAsHomestayCards = (messageContent) => {
  // ⚠️ TEMPORARILY DISABLED - Tạm thời tắt render HomestayCard, hiển thị text thuần
  return false;

  // if (!messageContent) return false;

  // // Check for JSON structure
  // if (typeof messageContent === "object") {
  //   return true;
  // }

  // // Check for text with homestay format
  // if (typeof messageContent === "string") {
  //   return (
  //     containsHomestayData(messageContent) && messageContent.includes("🏠")
  //   );
  // }

  // return false;
};
