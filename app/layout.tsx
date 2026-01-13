export const metadata = {
  title: "과학 수행평가 감점 방지",
  description: "과학 수행평가 구조 + 감점 기준 생성기",
  manifest: "/manifest.json",
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}