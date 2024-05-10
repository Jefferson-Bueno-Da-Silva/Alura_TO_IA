// import { useState } from 'react'
import { FormEvent, useState } from 'react';
import './App.css'
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai"
import { Box, Button, CircularProgress, FormControl, Link, TextField, Typography } from '@mui/material';
import Markdown from 'react-markdown'
import { DICTIONARY, SYSTEM_INSTRUCTION } from './constants/dictionary';


const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const [clinicalCase, setClinicalCase] = useState<string>()
  const [result, setResult] = useState('# Aguardando caso clinico...')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault()
    setLoading(true)
    const prompt = SYSTEM_INSTRUCTION + DICTIONARY.toString() + "formate usando markdown"
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME, systemInstruction: prompt,
      generationConfig: {
        candidateCount: 1,
        temperature: 0.5
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
      ],
    });

    if (clinicalCase) {
      const response = await model.generateContent(clinicalCase).finally(() => {
        setLoading(false)
      })
      setResult(response.response.text())
    }
  }


  return (
    <Box>
      <Typography variant='h3'>
        IA para: Apoio a Pais e Responsáveis de Crianças com TEA
      </Typography>

      <Box marginTop={10} display="flex" alignItems={"center"} component={"form"} onSubmit={onSubmit}>
        <FormControl fullWidth variant="standard">
          <TextField
            id="standard-multiline-flexible"
            label="Descreva o caso clinico do seu filho(a)"
            multiline
            maxRows={10}
            variant="standard"
            type='text'
            value={clinicalCase}
            onChange={(e) => setClinicalCase(e.target.value)}
            margin='dense'
          />
          <Button sx={{ marginTop: '1rem' }} disabled={loading || !clinicalCase} type='submit' variant='contained'>Envie seu caso</Button>
        </FormControl>
      </Box>
      <Box marginTop={10} component={"section"} minHeight={300} display={"flex"} flexDirection={"column"} alignItems={"start"}>
        <Typography alignSelf={"center"} variant='h6' marginBottom={2}>Resultado: </Typography>
        {loading ? (
          <CircularProgress sx={{ marginTop: "2rem", alignSelf: "center" }} color="secondary" />
        ) : (
          <Typography textAlign={"start"}>
            <Markdown>{result}</Markdown>
          </Typography>
        )}
      </Box>

      <Typography variant='h6'>Melhore seus resultados:</Typography>
      <Typography variant='body2'>
        Seja detalhista, forneça o máximo de informações possíveis sobre seu/sua filho(a),
        use o exemplo no final da pagina para visualizar a saída desejada.
      </Typography>
      <br />
      <Typography>Gemini: "Ao descrever uma pessoa, lugar ou coisa, não se limite a listar adjetivos. Mergulhe nos detalhes sensoriais! Em vez de dizer que um personagem tem "olhos bonitos", descreva a cor, a forma e a expressão deles"</Typography>

      <Box component={"section"} marginTop={8}>
        <Typography variant='h6' marginBottom={1}>Exemplo:</Typography>
        <Typography variant='body1'>Juju tinha 3 anos e 2 meses. Usava fraldas (não demonstrava incômodo quando havia urinado ou evacuado) e era completamente dependente no autocuidado. Não verbalizava nenhuma palavra, mas emitia sons de gritos. Deambulava de forma independente, corria e pulava. Não atendia pelo nome; não realizava contato visual; não dava nenhum tipo de respostas a comandos simples (como pegar algum objeto ou ir até o adulto quando chamada, por exemplo). Olhou para os brinquedos dispostos na sala, porém não teve interesse em explorá-los. Permaneceu o tempo todo andando em círculos ou tentando subir nos móveis da sala. Usava chupeta. Aceitava todas as consistências e texturas de alimentos.</Typography>
        <Typography variant='subtitle2' marginTop={2}>Caso fictício</Typography>
      </Box>

      <Box component={"section"} marginTop={8}>
        <Typography variant='h6' marginBottom={1}>Agradecimentos:</Typography>
        <Typography variant='body2'>Para a minha noiva Terapeuta ocupacional Sophya, excelente profissional e companheira</Typography>
        <Typography variant='body2'>Imersão IA Alura + Google</Typography>

        <br />
        <Typography variant='h6' marginTop={8}>Sobre:</Typography>
        <Typography variant='body2'>Este site não retem nenhuma informação do usuário</Typography>
        <Typography variant='caption'>Bibliografia: </Typography>
        <Link target='_blank' variant='caption' href='https://www.amazon.com.br/Ensino-habilidades-b%C3%A1sicas-pessoas-autismo/dp/652502353X'>Ensino de habilidades básicas para pessoas com autismo: Manual para intervenção comportamental intensiva</Link>

        <br />
        <Typography variant='caption'>Estilização: </Typography>
        <Link target='_blank' variant='caption' href='https://mui.com/'>https://mui.com/</Link>

        <br />
        <Typography variant='caption'>Estilização: </Typography>

      </Box>
    </Box >
  )
}

export default App
