import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

export default function Unsubscribe() {
  const [email, setEmail] = useState('');
  const [emailAdded, setEmailAdded] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const url_api = 'https://api.cafenews.com.br/unsubscribe';

  const handleEmailAdd = async () => {
    if (email.trim() === '') {
      setIsEmpty(true);
      return;
    }
    try {
      const response = await axios.delete(url_api, { email }, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (response.status === 200) {
        setEmailAdded(true);
        setTimeout(() => {
          setEmailAdded(false);
        }, 8000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 500) {
          toast.error('Preencha o formulário com um e-mail válido.');
        }
        toast.error(error.response?.data.message);
      } else {
        console.error('Erro desconhecido:', error);
      }
    }
  };

  return (
    <div className="bg-gray-200">
      <ToastContainer />
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <AnimatePresence initial={false}>
          {!emailAdded && (
            <motion.div
              key="email-form"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="w-80 flex flex-col"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.5 }}
                className="relative drop-shadow-md self-center"
              >
            <Image alt="Coffe image" src="/coffe-newsletter-unsub.svg" width={220} height={100} />
              </motion.div>
              <h1 className="font-bold text-xl mt-3 text-center">Café Newsletter</h1>
              <Input
                placeholder="Coloque seu e-mail"
                className={`mt-3 ${isEmpty ? 'border-red-500' : ''}`}
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsEmpty(false);
                }}
              />
              {isEmpty && <p className="text-red-500 mt-2">O campo de e-mail não pode estar vazio.</p>}
              <Button className="mt-3 w-full" onClick={handleEmailAdd}>
                Cancelar inscrição
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {emailAdded && (
            <motion.p
              key="email-added-message"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="mt-8 text-center"
            >
              😞 Que pena, fizemos o nosso melhor! <br/>
              Seu e-mail foi desativado...
            </motion.p>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
