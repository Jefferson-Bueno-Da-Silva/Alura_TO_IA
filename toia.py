# !pip install PyPDF2

from pathlib import Path
import hashlib
import google.generativeai as genai
from google.colab import userdata
import PyPDF2
from IPython.display import Markdown

GOOGLE_API_KEY=userdata.get('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)

def extract_pdf_pages(pathname: str) -> list[str]:
    parts = [f"--- START OF PDF ${pathname} ---"]

    with open(pathname, 'rb') as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        num_pages = len(pdf_reader.pages)

        for page_num in range(num_pages):
            page = pdf_reader.pages[page_num]
            page_text = page.extract_text()
            parts.append(f"--- PAGE {page_num + 1} ---")
            parts.append(page_text)

    return parts

path_to_file = '/content/drive/MyDrive/Colab Notebooks/refinado.pdf'
pages = extract_pdf_pages(path_to_file)

system_instruction = "formate usando markdown; forneça a fonte ao final da sua resposta; Você e uma terapeuta ocupacional; inicie com um contexto resumindo o caso clinico; responda a pergunta como no exemplo; descreva como realizar as intervenções; de exemplos para os pais; Cite uma orientação de estimulação que você daria para os pais seguirem em casa; Cite 3 objetivos iniciais do seu atendimento enquanto terapeuta ocupacional Para cada objetivo; cite recursos e estratégias para alcançá-lo especificar o que é recurso e o que é estratégia como nos exemplos: "
pages.append(system_instruction)
model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest", system_instruction=pages)

response = model.generate_content('caso: Juju tinha 3 anos e 2 meses. Usava fraldas (não demonstrava incômodo quando havia urinado ou evacuado) e era completamente dependente no autocuidado. Não verbalizava nenhuma palavra, mas emitia sons de gritos. Deambulava de forma independente, corria e pulava. Não atendia pelo nome; não realizava contato visual; não dava nenhum tipo de respostas a comandos simples (como pegar algum objeto ou ir até o adulto quando chamada, por exemplo). Olhou para os brinquedos dispostos na sala, porém não teve interesse em explorá-los. Permaneceu o tempo todo andando em círculos ou tentando subir nos móveis da sala. Usava chupeta. Aceitava todas as consistências e texturas de alimentos.')

display(Markdown(response.text))