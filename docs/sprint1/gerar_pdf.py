"""Gera o PDF da Sprint 1 — Modelagem do Sistema de Moeda Estudantil."""

from __future__ import annotations

import subprocess
from pathlib import Path

from fpdf import FPDF
from fpdf.enums import XPos, YPos

ROOT = Path(__file__).resolve().parent
DIAG = ROOT / "diagramas"
OUT_PDF = ROOT / "Lab03S01_Sprint1_Modelagem.pdf"
IMG_DIR = ROOT / "_tmp_diagramas"
JAR = IMG_DIR / "plantuml.jar"

FONT_R = "C:/Windows/Fonts/arial.ttf"
FONT_B = "C:/Windows/Fonts/arialbd.ttf"
FONT_I = "C:/Windows/Fonts/ariali.ttf"


class SprintPDF(FPDF):
    def header(self) -> None:
        if self.page_no() == 1:
            return
        self.set_font("ArialPT", "I", 8)
        self.set_text_color(90, 90, 90)
        self.cell(
            0,
            8,
            "Lab03S01 - Sprint 1: Modelagem | Sistema de Moeda Estudantil | PUC Minas",
            new_x=XPos.LMARGIN,
            new_y=YPos.NEXT,
        )
        self.set_draw_color(180, 180, 180)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)

    def footer(self) -> None:
        self.set_y(-15)
        self.set_font("ArialPT", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f"Pagina {self.page_no()}/{{nb}}", align="C")


def render_diagrams() -> dict[str, Path]:
    IMG_DIR.mkdir(exist_ok=True)
    pumls = [
        DIAG / "casos-de-uso.puml",
        DIAG / "classes.puml",
        DIAG / "componentes.puml",
    ]
    expected = {
        "casos": IMG_DIR / "Diagrama_Casos_de_Uso_Moeda_Estudantil.png",
        "classes": IMG_DIR / "Diagrama_Classes_Moeda_Estudantil.png",
        "componentes": IMG_DIR / "Diagrama_Componentes_Moeda_Estudantil.png",
    }
    if JAR.exists() and not all(p.exists() for p in expected.values()):
        cmd = ["java", "-jar", str(JAR), "-tpng", "-o", str(IMG_DIR), *[str(p) for p in pumls]]
        subprocess.run(cmd, check=True)
    # Also check if PlantUML wrote next to sources
    for key, name in [
        ("casos", "Diagrama_Casos_de_Uso_Moeda_Estudantil.png"),
        ("classes", "Diagrama_Classes_Moeda_Estudantil.png"),
        ("componentes", "Diagrama_Componentes_Moeda_Estudantil.png"),
    ]:
        alt = DIAG / name
        if alt.exists() and not expected[key].exists():
            expected[key].write_bytes(alt.read_bytes())
    return {k: v for k, v in expected.items() if v.exists()}


def place_image(pdf: SprintPDF, path: Path, max_w: float = 190, max_h: float = 220) -> None:
    """Insere imagem respeitando largura/altura máximas e quebrando página se preciso."""
    from PIL import Image

    with Image.open(path) as im:
        w_px, h_px = im.size
    # mm approximation at 96 dpi-ish: fpdf uses image natural size; we set w or h
    aspect = h_px / w_px
    w = max_w
    h = w * aspect
    if h > max_h:
        h = max_h
        w = h / aspect
    if pdf.get_y() + h > pdf.h - 20:
        pdf.add_page()
    pdf.image(str(path), x=(210 - w) / 2, w=w)
    pdf.ln(4)


def build_pdf(images: dict[str, Path]) -> None:
    pdf = SprintPDF(orientation="P", unit="mm", format="A4")
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_font("ArialPT", "", FONT_R)
    pdf.add_font("ArialPT", "B", FONT_B)
    pdf.add_font("ArialPT", "I", FONT_I)

    def h1(t: str) -> None:
        pdf.set_font("ArialPT", "B", 16)
        pdf.set_text_color(20, 50, 90)
        pdf.multi_cell(0, 9, t, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(2)

    def h2(t: str) -> None:
        pdf.ln(2)
        pdf.set_font("ArialPT", "B", 13)
        pdf.set_text_color(30, 70, 120)
        pdf.multi_cell(0, 8, t, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(1)

    def h3(t: str) -> None:
        pdf.ln(1)
        pdf.set_font("ArialPT", "B", 11)
        pdf.set_text_color(40, 40, 40)
        pdf.multi_cell(0, 7, t, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    def body(t: str) -> None:
        pdf.set_font("ArialPT", "", 10)
        pdf.set_text_color(30, 30, 30)
        pdf.multi_cell(0, 5.5, t, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(0.5)

    def bullet(t: str) -> None:
        pdf.set_font("ArialPT", "", 10)
        pdf.set_text_color(30, 30, 30)
        pdf.multi_cell(0, 5.5, f"- {t}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    def story(code, title, como, quero, para, prioridade, sprint, criterios) -> None:
        h3(f"{code} - {title}")
        body(f"Como {como}, quero {quero}, para {para}.")
        body(f"Prioridade: {prioridade}  |  Sprint: {sprint}")
        body(f"Critérios de aceite: {criterios}")

    # CAPA
    pdf.add_page()
    pdf.ln(40)
    pdf.set_font("ArialPT", "B", 22)
    pdf.set_text_color(20, 50, 90)
    pdf.multi_cell(0, 12, "Sistema de Moeda Estudantil", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(4)
    pdf.set_font("ArialPT", "B", 16)
    pdf.set_text_color(30, 70, 120)
    pdf.multi_cell(0, 10, "Lab03S01 - Sprint 1: Modelagem do Sistema", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(12)
    pdf.set_font("ArialPT", "", 12)
    pdf.set_text_color(40, 40, 40)
    for line in [
        "Disciplina: Projeto de Software",
        "Período: 2º Semestre/2026",
        "Professora: Milena Menezes Adão",
        "Instituição: Pontifícia Universidade Católica de Minas Gerais",
        "Curso: Engenharia de Software",
        "Pontuação da disciplina: 20,00 pontos",
    ]:
        pdf.multi_cell(0, 8, line, align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(16)
    pdf.set_font("ArialPT", "B", 12)
    pdf.multi_cell(0, 8, "Entregáveis desta sprint", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("ArialPT", "", 11)
    for item in [
        "1. Diagrama de Casos de Uso",
        "2. Histórias do Usuário",
        "3. Diagrama de Classes",
        "4. Diagrama de Componentes",
    ]:
        pdf.multi_cell(0, 7, item, align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # 1. INTRO
    pdf.add_page()
    h1("1. Descrição do Sistema e Regras de Negócio")
    body(
        "O objetivo é desenvolver um sistema baseado na arquitetura MVC para estimular "
        "o reconhecimento do mérito estudantil através de uma moeda virtual."
    )
    h2("1.1 Atores e Cadastros")
    bullet("Alunos: cadastro com Nome, Email, CPF, RG, Endereço, Instituição de Ensino (pré-cadastrada) e Curso.")
    bullet("Professores: pré-cadastrados (lista da instituição). Nome, CPF, Departamento e vínculo com Instituição.")
    bullet("Empresas Parceiras: cadastram-se para oferecer vantagens.")
    bullet("Autenticação: Login e Senha obrigatórios para todas as operações.")
    h2("1.2 Distribuição de Moedas (Professores)")
    bullet("Recebem 1.000 moedas por semestre.")
    bullet("Saldo acumulável (moedas não usadas somam-se ao próximo semestre).")
    bullet("Envio exige saldo suficiente e mensagem aberta com o motivo do reconhecimento.")
    h2("1.3 Troca de Vantagens")
    bullet("Empresas cadastram vantagens: Descrição, Foto e Custo (em moedas).")
    bullet("Aluno resgata vantagem; valor debitado do saldo.")
    h2("1.4 Notificações e Extratos")
    bullet("Extrato: professores veem envios; alunos veem recebimentos e trocas; ambos veem saldo.")
    bullet("E-mail ao aluno ao receber moedas.")
    bullet("Após resgate: e-mail ao aluno (cupom + código) e e-mail à empresa para conferência.")

    # 2. CASOS DE USO
    pdf.add_page()
    h1("2. Diagrama de Casos de Uso")
    body(
        "Atores: Aluno, Professor, Empresa Parceira e Sistema. Relações <<include>> indicam "
        "autenticação obrigatória e disparo automático das notificações por e-mail."
    )
    if "casos" in images:
        place_image(pdf, images["casos"], max_w=170, max_h=230)

    pdf.add_page()
    h2("2.1 Descrição dos Casos de Uso")
    casos = [
        ("UC01", "Cadastrar Aluno", "Aluno", "Instituição pré-cadastrada",
         "Informar dados pessoais, instituição, curso, login e senha; validar e persistir com saldo 0.",
         "Aluno cadastrado"),
        ("UC02", "Cadastrar Empresa Parceira", "Empresa Parceira", "-",
         "Informar dados cadastrais, login e senha; validar e persistir.",
         "Empresa apta a autenticar e cadastrar vantagens"),
        ("UC03", "Autenticar Usuário", "Aluno, Professor, Empresa", "Usuário cadastrado",
         "Informar login e senha; validar e identificar perfil.",
         "Sessão autenticada. Obrigatório para todas as operações."),
        ("UC04", "Pré-cadastrar Professor", "Sistema", "Lista da instituição",
         "Cadastrar Nome, CPF, Departamento, Instituição, login e senha.",
         "Professor vinculado à instituição/departamento"),
        ("UC05", "Creditar Moedas Semestrais", "Sistema", "Início do semestre",
         "Creditar 1.000 moedas; saldo acumulável.", "Saldo do professor atualizado"),
        ("UC06", "Enviar Moedas ao Aluno", "Professor", "Autenticado; saldo suficiente",
         "Selecionar aluno e valor; mensagem obrigatória; debitar/creditar e registrar.",
         "Transação registrada; inclui UC12"),
        ("UC07", "Consultar Extrato Professor", "Professor", "Autenticado",
         "Exibir saldo e lista de envios (aluno, valor, mensagem, data).", "Extrato visualizado"),
        ("UC08", "Cadastrar Vantagem", "Empresa", "Autenticada",
         "Informar Descrição, Foto e Custo; vincular a empresa.", "Vantagem disponível"),
        ("UC09", "Gerenciar Vantagens", "Empresa", "Autenticada",
         "Listar, editar ou remover vantagens próprias.", "Catálogo atualizado"),
        ("UC10", "Resgatar Vantagem", "Aluno", "Autenticado; saldo >= custo",
         "Escolher vantagem; debitar; gerar cupom/código; notificar.",
         "Resgate concluído; inclui UC13"),
        ("UC11", "Consultar Extrato Aluno", "Aluno", "Autenticado",
         "Exibir saldo, recebimentos e trocas.", "Extrato visualizado"),
        ("UC12", "Notificar Recebimento", "Sistema", "UC06 concluído",
         "E-mail ao aluno com valor, professor e mensagem.", "Aluno notificado"),
        ("UC13", "Notificar Resgate", "Sistema", "UC10 concluído",
         "E-mail ao aluno (cupom+código) e à empresa (conferência).", "Partes notificadas"),
    ]
    for code, nome, ator, pre, fluxo, pos in casos:
        h3(f"{code} - {nome}")
        body(f"Ator: {ator}")
        body(f"Pré-condição: {pre}")
        body(f"Fluxo: {fluxo}")
        body(f"Pós-condição: {pos}")

    # 3. HISTORIAS
    pdf.add_page()
    h1("3. Histórias do Usuário")
    body("Formato: Como [ator], quero [ação], para [benefício].")

    h2("Épico 1 - Autenticação e Cadastro")
    story("US-01", "Cadastro de Aluno", "aluno",
          "me cadastrar informando Nome, E-mail, CPF, RG, Endereço, Instituição e Curso",
          "ter acesso ao sistema e receber moedas", "Alta", "2-3",
          "Dados obrigatórios; instituição existente; login/senha; e-mail e CPF únicos.")
    story("US-02", "Cadastro de Empresa Parceira", "empresa parceira",
          "me cadastrar no sistema", "oferecer vantagens aos alunos", "Alta", "2-3",
          "Cadastro com login/senha; empresa autenticada gerencia vantagens.")
    story("US-03", "Login no sistema", "aluno, professor ou empresa",
          "autenticar-me com login e senha", "acessar operacoes do meu perfil", "Alta", "2-3",
          "Autenticação obrigatória; perfil correto; credenciais inválidas rejeitadas.")
    story("US-04", "Pré-cadastro de Professor", "instituição (via sistema)",
          "que professores sejam pré-cadastrados com Nome, CPF, Departamento e Instituição",
          "que distribuam moedas sem auto-cadastro", "Alta", "3",
          "Vínculo instituição/departamento; login/senha; 1.000 moedas/semestre.")

    h2("Épico 2 - Distribuição de Moedas")
    story("US-05", "Crédito semestral", "professor",
          "receber 1.000 moedas no início de cada semestre", "reconhecer o mérito dos alunos",
          "Alta", "3", "Credito de 1.000; saldo acumulável.")
    story("US-06", "Enviar moedas a um aluno", "professor",
          "enviar moedas informando valor e mensagem com o motivo",
          "reconhecer comportamento, participação ou outro mérito", "Alta", "3",
          "Saldo >= valor; mensagem obrigatória; debito/credito; registro no extrato.")
    story("US-07", "Extrato do professor", "professor",
          "visualizar saldo e extrato das moedas enviadas", "controlar a distribuição",
          "Alta", "3", "Saldo atual; lista com aluno, valor, mensagem e data.")

    h2("Épico 3 - Troca de Vantagens")
    story("US-08", "Cadastrar vantagem", "empresa parceira",
          "cadastrar vantagem com Descrição, Foto e Custo", "oferecer benefícios",
          "Alta", "3", "Campos obrigatórios; custo > 0; vinculada à empresa.")
    story("US-09", "Gerenciar vantagens", "empresa parceira",
          "listar, editar e remover minhas vantagens", "manter ofertas atualizadas",
          "Média", "3", "Só altera as próprias; mudanças refletem na listagem.")
    story("US-10", "Resgatar vantagem", "aluno",
          "escolher e resgatar uma vantagem", "trocar moedas por benefícios",
          "Alta", "3", "Saldo >= custo; débito; cupom/código; extrato.")
    story("US-11", "Extrato do aluno", "aluno",
          "ver saldo, moedas recebidas e trocas", "acompanhar mérito e resgates",
          "Alta", "3", "Saldo; histórico de recebimentos e resgates.")

    h2("Épico 4 - Notificações")
    story("US-12", "E-mail ao receber moedas", "aluno",
          "receber e-mail ao ganhar moedas", "ser notificado do reconhecimento",
          "Alta", "3", "E-mail após envio; contém valor, professor e mensagem.")
    story("US-13", "E-mails de resgate", "aluno e empresa",
          "receber e-mails após o resgate", "usar cupom presencialmente e conferir a troca",
          "Alta", "3", "Código gerado; e-mail ao aluno e à empresa.")

    h2("Épico 5 - CRUDs iniciais (Sprint 2)")
    story("US-14", "CRUD de Aluno (inicial)", "usuário do sistema",
          "criar, consultar, atualizar e remover alunos com front integrado ao back",
          "ter base persistente na Sprint 2", "Alta", "2",
          "Persistência ORM/DAO; telas integradas; validações básicas.")
    story("US-15", "CRUD de Empresa (inicial)", "usuário do sistema",
          "CRUD de empresas com front integrado ao back",
          "preparar fluxo de vantagens", "Alta", "2",
          "Persistência alinhada ao MER; telas; validações.")

    h2("3.1 Mapeamento História → Caso de Uso")
    body("US-01 -> UC01 | US-02 -> UC02 | US-03 -> UC03 | US-04 -> UC04")
    body("US-05 -> UC05 | US-06 -> UC06 | US-07 -> UC07")
    body("US-08 -> UC08 | US-09 -> UC09 | US-10 -> UC10 | US-11 -> UC11")
    body("US-12 -> UC12 | US-13 -> UC13 | US-14/US-15 -> UC01/UC02 (+ manutenção CRUD)")

    # 4. CLASSES
    pdf.add_page()
    h1("4. Diagrama de Classes")
    body(
        "Modelo de domínio da camada Model (MVC). Controllers e Views estão no diagrama de "
        "componentes. Hierarquia Usuario ← Aluno | Professor | EmpresaParceira. Serviços "
        "encapsulam regras de moeda, resgate e notificação."
    )
    if "classes" in images:
        place_image(pdf, images["classes"], max_w=195, max_h=240)

    pdf.add_page()
    h2("4.1 Principais classes e responsabilidades")
    for nome, desc in [
        ("Usuario (abstrata)", "id, login, senha, email; autenticar()."),
        ("Aluno", "nome, cpf, rg, endereço, saldo; resgatarVantagem(); consultarExtrato()."),
        ("Professor", "nome, cpf, departamento, saldo; enviarMoedas(); receberCreditoSemestral()."),
        ("EmpresaParceira", "nome, cnpj; cadastrar/atualizar/remover vantagens."),
        ("InstituicaoEnsino / Curso / Endereco", "vínculo acadêmico e localização."),
        ("Vantagem", "descrição, fotoUrl, custoMoedas, ativa."),
        ("TransacaoMoeda", "valor, mensagem obrigatória, dataHora; Professor -> Aluno."),
        ("Resgate", "codigoCupom, valorDebitado, dataHora; Aluno -> Vantagem."),
        ("CreditoSemestral", "semestre, valor (1.000), dataCredito."),
        ("ServicoAutenticacao", "login/logout."),
        ("ServicoMoeda", "envio com validação de saldo/mensagem; crédito semestral."),
        ("ServicoResgate", "débito, geração de cupom."),
        ("ServicoNotificacao", "e-mails de recebimento e resgate."),
    ]:
        body(f"{nome}: {desc}")

    h2("4.2 Regras de negócio nas classes")
    bullet("Login/senha -> Usuario + ServicoAutenticacao")
    bullet("1.000 moedas/semestre acumuláveis -> CreditoSemestral + Professor.saldoMoedas")
    bullet("Envio com mensagem e saldo -> ServicoMoeda / TransacaoMoeda")
    bullet("Vantagem (descricao, foto, custo) -> Vantagem")
    bullet("Resgate com cupom -> Resgate.codigoCupom + ServicoResgate")
    bullet("E-mails -> ServicoNotificacao")

    h2("4.3 Multiplicidades")
    bullet("Instituição 1 - N Alunos / Professores")
    bullet("Curso 1 - N Alunos")
    bullet("Empresa 1 - N Vantagens")
    bullet("Professor/Aluno 1 - N Transações")
    bullet("Aluno/Vantagem 1 - N Resgates")

    # 5. COMPONENTES
    pdf.add_page()
    h1("5. Diagrama de Componentes")
    body(
        "Arquitetura MVC: Apresentação (View), Controle (Controller), Negócio (Model/Services), "
        "Persistência (DAO/ORM) e serviço externo de e-mail (SMTP)."
    )
    if "componentes" in images:
        place_image(pdf, images["componentes"], max_w=185, max_h=220)

    h2("5.1 Responsabilidades por camada")
    bullet("View: telas web por perfil; sem regra de negócio.")
    bullet("Controller: recebe requisições, valida entrada, aciona serviços, devolve resposta.")
    bullet("Model/Services: regras de saldo, mensagem, crédito semestral, cupom e notificações.")
    bullet("Persistência: CRUD/consultas; isola o SGBD (detalhar na Sprint 2).")
    bullet("E-mail: notificacoes UC12 e UC13.")

    h2("5.2 Fluxos principais")
    h3("Envio de moedas")
    body("View Professor -> ProfessorController -> ServicoMoeda -> valida saldo/mensagem -> persiste TransacaoMoeda -> ServicoNotificacao -> e-mail ao aluno.")
    h3("Resgate de vantagem")
    body("View Aluno -> ResgateController -> ServicoResgate -> debita saldo -> gera cupom -> persiste Resgate -> ServicoNotificacao -> e-mails ao aluno e à empresa.")
    h3("CRUD Aluno / Empresa (Sprint 2)")
    body("Views Cadastro -> AlunoController / EmpresaController -> entidades -> DAO/ORM -> Banco.")

    h2("5.3 Decisões de arquitetura")
    bullet("MVC clássico, exigido pelo enunciado.")
    bullet("Serviços de domínio fora dos Controllers.")
    bullet("Persistência encapsulada (ORM ou DAO na Sprint 2).")
    bullet("ServicoNotificacao dedicado ao SMTP, desacoplado da UI.")

    # 6. RASTREABILIDADE
    pdf.add_page()
    h1("6. Rastreabilidade e próximos passos")
    h2("6.1 Alinhamento requisito -> artefato")
    bullet("Cadastro aluno/empresa; professor pré-cadastrado -> UC01-UC04, US-01-US-04")
    bullet("Login/senha obrigatórios -> UC03, Usuario, ServicoAutenticacao")
    bullet("1.000 moedas/semestre acumuláveis -> UC05, CreditoSemestral")
    bullet("Envio com mensagem e saldo -> UC06, ServicoMoeda, TransacaoMoeda")
    bullet("Vantagens e resgate -> UC08-UC10, Vantagem, Resgate")
    bullet("Extratos -> UC07, UC11")
    bullet("E-mails -> UC12, UC13, ServicoNotificacao")
    bullet("Arquitetura MVC -> Diagrama de Componentes")

    h2("6.2 Próximos passos (Sprint 2 - Lab03S02)")
    bullet("Modelo Entidade-Relacionamento (MER)")
    bullet("Estratégia de acesso ao banco (ORM ou DAO)")
    bullet("CRUD de Aluno (front integrado ao back)")
    bullet("CRUD de Empresa Parceira (front integrado ao back)")

    pdf.ln(10)
    pdf.set_font("ArialPT", "I", 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(
        0,
        6,
        "Documento gerado para a Sprint 1 (Lab03S01). Diagramas UML exportados via PlantUML. "
        "Os modelos serão atualizados conforme a evolução do projeto (Sprints 2 e 3).",
        new_x=XPos.LMARGIN,
        new_y=YPos.NEXT,
    )

    pdf.output(str(OUT_PDF))
    print(f"PDF gerado: {OUT_PDF}")


def main() -> None:
    images = render_diagrams()
    print("Diagramas:", {k: v.name for k, v in images.items()})
    build_pdf(images)


if __name__ == "__main__":
    main()
