import { provider } from "./provider";

export interface TicketMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

/**
 * 渲染 NFT Ticket，返回 SVG 二进制流
 * @param ticketId Ticket ID
 * @returns Promise<string> SVG 数据 URL (base64)
 */
export const renderTicket = async (ticketId: string): Promise<string> => {
  try {
    const response = await provider.request<Blob>({
      url: `/asset/render-template/${ticketId}`,
      method: "GET",
      responseType: "blob", // 处理二进制流
    });

    // 将 blob 转换为 base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(response.data);
    });
  } catch (error) {
    console.error("Failed to render ticket:", error);
    throw error;
  }
};

export const renderTicketByDna = async (dna: string): Promise<string> => {
  try {
    const response = await provider.request<Blob>({
      url: `/asset/render/${dna}`,
      method: "GET",
      responseType: "blob", // 处理二进制流
    });

    // 将 blob 转换为 base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(response.data);
    });
  } catch (error) {
    console.error("Failed to render ticket:", error);
    throw error;
  }
};

export const renderTicketMetadata = async (dna: string) =>
  provider.request<TicketMetadata>({
    url: `/asset/metadata/${dna}`,
    method: "GET",
  });
