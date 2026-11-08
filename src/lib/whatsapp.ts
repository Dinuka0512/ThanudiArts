export const WHATSAPP_NUMBER = "94787869177";

export const START_PROJECT_MESSAGE =
  "Hi Thanudi Arts! I'd like to start a project — could we talk about what I have in mind?";

export const whatsappLink = (message?: string) => {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

interface ProductEnquiry {
  name: string;
  type?: string;
  price?: string;
  url?: string;
}

export const productEnquiryMessage = ({ name, type, price, url }: ProductEnquiry) => {
  const details = [
    name,
    type ? `Type: ${type}` : "",
    price ? `Price: LKR ${price}` : "",
    url ? `Link: ${url}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `Hi Thanudi Arts! I'd like to buy this piece:\n\n${details}\n\nIs it still available?`;
};

export const productEnquiryLink = (product: ProductEnquiry) =>
  whatsappLink(productEnquiryMessage(product));
