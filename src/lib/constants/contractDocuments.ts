export const CONTRACT_DOCUMENT_TYPES = {
  "business-registration": {
    pathColumn: "business_registration_file_path",
    nameColumn: "business_registration_file_name",
    allowedMimeTypes: new Set(["application/pdf", "image/jpeg", "image/png"]),
    label: "사업자등록증",
  },
  "bank-account-image": {
    pathColumn: "bank_account_image_path",
    nameColumn: "bank_account_image_name",
    allowedMimeTypes: new Set(["image/jpeg", "image/png", "image/webp"]),
    label: "계좌 이미지",
  },
} as const;

export type ContractDocumentType = keyof typeof CONTRACT_DOCUMENT_TYPES;

const CONTRACT_DOCUMENT_TYPE_KEYS = new Set<string>(Object.keys(CONTRACT_DOCUMENT_TYPES));

export function isContractDocumentType(value: string): value is ContractDocumentType {
  return CONTRACT_DOCUMENT_TYPE_KEYS.has(value);
}
