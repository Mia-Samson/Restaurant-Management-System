const API_URL = import.meta.env.VITE_API_URL || "/api";

async function requestJson(endpoint, options = {}) {
  const { headers: optionHeaders, ...restOptions } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(optionHeaders || {}),
    },
    ...restOptions,
  });

  const contentType = response.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    const text = await response.text();
    data = text ? { message: text } : null;
  }

  if (!response.ok || data?.status === false) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export default API_URL;
export { requestJson };
