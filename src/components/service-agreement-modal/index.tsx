"use client";
import React, { useState, useEffect } from "react";
import { DocumentModal } from "@/components/document-modal";
import { useTranslations } from "next-intl";

interface ServiceAgreementModalProps {
  show: boolean;
  onClose: () => void;
  mounted: boolean;
  isNFT?: boolean;
}

export const ServiceAgreementModal: React.FC<ServiceAgreementModalProps> = ({
  show,
  onClose,
  mounted,
  isNFT,
}) => {
  const tCommon = useTranslations("common");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (show && mounted) {
      setLoading(true);
      fetch(isNFT ? "/docs/NFTPrivacyPolicy.md" : "/docs/userServiceAgreement.md")
        .then((res) => res.text())
        .then((text) => {
          setContent(text);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load service agreement:", error);
          setContent("# Error\n\nFailed to load the service agreement document.");
          setLoading(false);
        });
    }
  }, [show, mounted]);

  if (!mounted) return null;

  return (
    <DocumentModal
      show={show}
      title={tCommon("terms.service")}
      content={loading ? "Loading..." : content}
      onClose={onClose}
      mounted={mounted}
    />
  );
};
