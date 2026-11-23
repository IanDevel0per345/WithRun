# Ícones da plataforma

Todos os ícones da interface vêm das folhas de ícones fornecidas (preta e branca)
e foram recortados em PNG transparente:

- `black/<nome>.png` – usado no tema claro
- `white/<nome>.png` – usado no tema escuro

Uso no código: `<SheetIcon name="computer" size={20} />`
(`components/ui/sheet-icon.tsx`). Os nomes válidos estão no tipo `SheetIconName`.

Regra do projeto: novos ícones devem sair dessas mesmas folhas.
Fora desse padrão ficam só logos de marcas (OpenAI, GitHub etc.) e spinners de carregamento.
