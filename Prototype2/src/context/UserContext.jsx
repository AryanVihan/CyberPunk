import React, { createContext, useState } from 'react'
import run from '../gemini';
export const datacontext=createContext()

function UserContext({children}) {
    let [speaking,setSpeaking]=useState(false)
    let [prompt,setPrompt]=useState("listening...")
    let [response,setResponse]=useState(false)

    function speak(text){
        let text_speak=new SpeechSynthesisUtterance(text)
        text_speak.volume=1;
        text_speak.rate=1;
        text_speak.pitch=1;
        text_speak.lang="hi-GB"
        window.speechSynthesis.speak(text_speak)
    }
    async function aiResponse(prompt){
        let text=await run(prompt)
        let newText=text.split("**")&&text.split("*")&&text.replace("google", "Aryan The Goat")&&text.replace("Google", "Aryan The Goat")
        setPrompt(newText)
        speak(newText)
        setResponse(true)
        setTimeout(()=>{
            setSpeaking(false)
        },5000)


    }
    let speechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition
    let recognition=new speechRecognition()
    recognition.onresult=(e)=>{
        let currentIndex=e.resultIndex
        let transcript=e.results[currentIndex][0].transcript
        setPrompt(transcript)
        takeCommand(transcript.toLowerCase())
    }

    function takeCommand(command){
        if(command.includes("open")&& command.includes("youtube")){
            window.open("https://www.youtube.com/","_blank")
            speak("opening Youtube")
            setResponse(true)
            setPrompt("opening Youtube...")
            setTimeout(()=>{
                setSpeaking(false)
            },5000)
        } 
        else if (command.includes("open") && command.includes("exercises")) {
            window.open("http://localhost:8000/exercises.html", "_blank");
            speak("Opening Exercises");
            setResponse(true);
            setPrompt("Opening Exercises...");
            setTimeout(() => {
                setSpeaking(false);
            }, 5000);
        }
        else if (command.includes("open") && command.includes("to do list")) {
            window.open("http://localhost:3000/tdlindex.html", "_blank");
            speak("Opening To Do List");
            setResponse(true);
            setPrompt("Opening To Do List...");
            setTimeout(() => {
                setSpeaking(false);
            }, 5000);
        }
        
        else if(command.includes("open")&& command.includes("google")){
            window.open("https://www.google.com/","_blank")
            speak("opening Google")
            setResponse(true)
            setPrompt("opening Google...")
            setTimeout(()=>{
                setSpeaking(false)
            },5000)
        } else if(command.includes("open")&& command.includes("instagram")){
            window.open("https://www.instagram.com/","_blank")
            speak("opening Instagram")
            setResponse(true)
            setPrompt("opening Instagram...")
            setTimeout(()=>{
                setSpeaking(false)
            },5000)
        } else if(command.includes("time")){
            let time=new Date().toLocaleString(undefined,{hour:"numeric",minute:"numeric"})
            speak(time)
            setResponse(true)
            setPrompt(time)
            setTimeout(()=>{
                setSpeaking(false)
            },5000)
        }
        else if(command.includes("date")){
            let date=new Date().toLocaleString(undefined,{day:"numeric",month:"short"})
            speak(date)
            setResponse(true)
            setPrompt(date)
            setTimeout(()=>{
                setSpeaking(false)
            },5000)
        }
        else{
            aiResponse(command)
        }
    }

    let value={
        recognition,
        speaking,
        setSpeaking,
        prompt,
        setPrompt,
        response,
        setResponse
    }
    return (
        <div>
            <datacontext.Provider value={value}>
            {children}
            </datacontext.Provider>
        </div>
    )
}

export default UserContext