
const path = require('path');
const express = require('express');


require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabase = require('./supabaseClient');

const app = express();
app.use(express.json());
// Configuração de arquivos estáticos removida (Vite/Vercel cuidam disso)


// 6. Rota de API (Exemplo para os imóveis)
app.get('/api/corretores', async (req, res) => {
    const { data, error } = await supabase.from('corretores').select('*');

    if (error) return res.status(500).json({ error: error.message });

    res.json(data); 
});

app.get('/api/imoveis', async (req, res) => {
    const { data, error } = await supabase.from('imoveis').select('*');

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
});

app.get('/api/imoveis/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('imoveis')
        .select('*, corretores (nome, telefone, img)')
        .eq('id', id)
        .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Imóvel não encontrado' });

    res.json(data);
});

app.post('/api/contatos', async (req, res) => {
    try {
        const { nome, whatsapp, mensagem, imovel_titulo, destinatario } = req.body;

        if (!nome || !whatsapp) {
            return res.status(400).json({ error: 'Nome e Whatsapp são campos obrigatórios.' });
        }

        // Construir mensagem final com contexto do imóvel se aplicável
        let mensagemFinal = mensagem || '';
        if (imovel_titulo) {
            mensagemFinal = `[Imóvel de Interesse: ${imovel_titulo}] ${mensagemFinal}`.trim();
        }

        // Montar o objeto de inserção
        // Se destinatario não for enviado (index.html / contato.html), não incluímos no insert
        // para que o DEFAULT 'adm' do Supabase seja aplicado automaticamente.
        // Se destinatario for enviado (sobre-imovel.html), é o UUID do corretor responsável.
        const insertData = { nome, whatsapp, mensagem: mensagemFinal };

        if (destinatario) {
            insertData.destinatario = destinatario;
        }

        const { data, error } = await supabase
            .from('contato')
            .insert([insertData]);

        if (error) throw error;

        res.json({ success: true, message: 'Mensagem de contato salva com sucesso!' });
    } catch (err) {
        console.error('Erro ao salvar contato no Supabase:', err);
        res.status(500).json({ error: err.message });
    }
});

const port = process.env.PORT || 3000;

// Exportar o app para ambientes Serverless (como a Vercel)
module.exports = app;

// Apenas escutar a porta localmente se não estiver em produção/Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`\n✅ Sucesso! Servidor rodando em: http://localhost:${port}`);
    });
}