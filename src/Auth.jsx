import { useState } from "react";
import { supabase } from "./supabaseClient";
import { LoadingIcon } from "./components/icons"

export default function Auth(){
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        const {user, error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error){
            alert(error.error_description || error.message);
        } else {
            if (user) {
                setEmail(user.email);
            }    
        }

        setLoading(false);
    }

    return(
        <div className="h-screen bg-red-100 ">
        <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-xl font-bold ">
                Weather Station Telem&aacute;tica
            </h1>
            <h1 className="text-2x1 font-bold py-10">
                Inicio de sesi&oacute;n
            </h1>
            <form onSubmit={handleLogin}>
                <div className="flex flex-col justify-center space-y-2">
                <label htmlFor="email" className="font-bold">
                    Correo electr&oacute;nico
                </label>
                <input 
                    className="border border-black px-4 py-2 rounded-lg" 
                    type="email" 
                    placeholder="Correo electr&oacute;nico"
                    value={email}
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password" className="font-bold pt-4">
                    Contrase&ntilde;a
                </label>
                <input 
                className="border border-black px-4 py-2 rounded-lg" 
                type="password"
                placeholder="Contrase&ntilde;a"
                value={password}
                required={true}
                onChange={(e) => setPassword(e.target.value)} 
                />
                <button 
                disabled={loading}
                className="inline-flex items-center justify-center px-4 py-2 mt-4 bg-blue-800 text-white font-bold rounded-lg"
                >
                    {loading
                        ? (
                          <>
                           <LoadingIcon/>
                        <span>Inicioando sesi&oacute;n</span>
                        </>
                        )
                        : <span>Inicia sesi&oacute;n</span>
                    }
                </button>
                </div>
            </form>
        </div>
        </div>
    )
}