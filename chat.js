(function() {
  // ─── CONFIGURAÇÃO ───
  const AVATAR_URL         = "https://assets.zyrosite.com/mnl431l6n6HPgpkZ/andra-c-ia-agente-iddeia-mxB2anxZqZi6b7Zn.png";
  const WEBHOOK_URL        = "https://iddeia-n8n.cloudfy.live/webhook/01e3cc1f-c38f-4351-ab2a-8a5950b8ebdf";
  const INITIAL_RESPONSE   = "Pronto! Agora posso te ajudar\nQual serviço você gostaria de conhecer?\n\n- Criação de Sites\n- CRM\n- Automações";

  // Injeta o HTML
  const chatHTML = `
    <div id="chat-launcher" onclick="toggleChat()">
      <div class="chat-avatar">
        <img id="avatar-img" src="${AVATAR_URL}" alt="Avatar" />
      </div>
      <div class="chat-greeting">
        <div><strong>Olá 👋</strong></div>
        <div>Possui alguma dúvida?</div>
      </div>
    </div>
    <div id="chat-container">
      <div class="chat-header">
        <span><img id="header-img" src="${AVATAR_URL}" alt="Avatar" /> iddeia - Andréia</span>
        <span style="cursor:pointer;" onclick="toggleChat()">✖</span>
      </div>
      <div class="chat-body" id="chatlog">
        <div class="chat-bubble chat-welcome">
          <strong>Oi! 👋</strong><br>
          Eu sou a <strong>Andréia</strong>, assistente da iddeia. Posso te ajudar com sites, lojas ou crm ou automações.<br>
          <button onclick="startChat()">Sim, conversar agora</button>
        </div>
        <div class="chat-form" id="step-nome" style="display: none; flex-direction: column; gap: 10px;">
          <label><strong>Qual seu nome?</strong></label>
          <input type="text" id="user-name" placeholder="Digite seu nome..." />
          <button onclick="enviarNome()">Continuar</button>
        </div>
        <div class="chat-form" id="step-whatsapp" style="display: none; flex-direction: column; gap: 10px;">
          <label><strong>Qual seu WhatsApp (com DDD)?</strong></label>
          <input type="text" id="user-whatsapp" placeholder="Ex: (xx) xxxxx-xxxx" />
          <button onclick="enviarWhatsapp()">Iniciar Atendimento</button>
        </div>
      </div>
      <div class="chat-footer" id="chatfooter" style="display: none;">
        <input id="chatinput" type="text" placeholder="Digite sua mensagem..." onkeydown="if(event.key==='Enter'){sendChat()}">
        <button onclick="sendChat()">Enviar</button>
      </div>
    </div>
  `;

  // Injeta o CSS
  const chatCSS = `
    * { box-sizing: border-box; }
    #chat-launcher { position: fixed; bottom: 20px; right: 20px; display: flex; align-items: center; background: white; border: 1px solid #ddd; border-radius: 50px; padding: 10px 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); cursor: pointer; z-index: 9999; transition: all 0.3s ease; }
    #chat-launcher:hover { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25); }
    .chat-avatar img { width: 36px; height: 36px; border-radius: 50%; margin-right: 12px; }
    .chat-greeting { display: flex; flex-direction: column; font-size: 14px; color: #333; font-family: 'Segoe UI', sans-serif; text-align: left; }
    .chat-greeting strong { font-weight: 600; font-size: 15px; color: #0073e6; }
    #chat-container { position: fixed; bottom: 100px; right: 20px; width: 380px; height: auto; min-height: 500px; max-height: 60vh; background: white; border-radius: 16px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.2); overflow: hidden; display: none; flex-direction: column; font-family: 'Segoe UI', sans-serif; z-index: 9999; }
    .chat-header { background: #FF8C00; color: white; padding: 16px; font-weight: bold; font-size: 16px; display: flex; align-items: center; justify-content: space-between; }
    .chat-header img { width: 36px; height: 36px; border-radius: 50%; margin-right: 10px; object-fit: cover; }
    .chat-body { padding: 16px; flex: 1; overflow-y: auto; font-size: 14px; display: flex; flex-direction: column; background-color: #fafafa; }
    .chat-bubble { background: #f1f1f1; border-radius: 14px; padding: 12px 14px; margin-bottom: 10px; max-width: 85%; font-size: 14px; line-height: 1.4; }
    .chat-bubble.user { background: #FF8C00; color: white; align-self: flex-end; }
    .chat-footer { border-top: 1px solid #eee; padding: 12px; display: flex; gap: 8px; background: #fff; }
    .chat-footer input { flex: 1; padding: 10px 14px; border: 1px solid #ccc; border-radius: 8px; font-size: 14px; }
    .chat-footer button { background: #FF8C00; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; }
    .chat-form input { padding: 10px 14px; border-radius: 8px; border: 1px solid #ccc; font-size: 14px; }
    .chat-form button { margin-top: 12px; padding: 10px 16px; border: none; background: #FF8C00; color: white; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; }
    .chat-welcome button { margin-top: 12px; padding: 10px 16px; border: none; background: #FF8C00; color: white; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; box-shadow: none; }
    label { font-weight: 500; font-size: 15px; margin-bottom: 4px; color: #333; }
  `;

  // Aguarda o DOM estar pronto
  document.addEventListener('DOMContentLoaded', function() {
    // Injeta CSS
    const style = document.createElement('style');
    style.textContent = chatCSS;
    document.head.appendChild(style);

    // Injeta HTML
    const container = document.createElement('div');
    container.innerHTML = chatHTML;
    document.body.appendChild(container);

    // Injeta as funções globais
    window.toggleChat = toggleChat;
    window.startChat = startChat;
    window.enviarNome = enviarNome;
    window.enviarWhatsapp = enviarWhatsapp;
    window.sendChat = sendChat;

    // Carrega as imagens
    document.getElementById("avatar-img").src = AVATAR_URL;
    document.getElementById("header-img").src = AVATAR_URL;

    // Máscara WhatsApp
    const whatsappInput = document.getElementById('user-whatsapp');
    if (whatsappInput) {
      whatsappInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '').slice(0, 11);
        if (value.length <= 2) value = value.replace(/(\d{0,2})/, '($1');
        else if (value.length <= 7) value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        else value = value.replace(/(\d{2})(\d{1})(\d{0,4})(\d{0,4})/, '($1) $2 $3-$4');
        e.target.value = value.trim().replace(/-$/, '');
      });
    }
  });

  // Funções do chat
  let userData = { nome: '', whatsapp: '', session: 'iddeia-usuario' };

  function toggleChat() {
    const chat = document.getElementById('chat-container');
    chat.style.display = (chat.style.display === 'flex') ? 'none' : 'flex';
  }

  function startChat() {
    document.querySelector('.chat-welcome').style.display = 'none';
    document.getElementById('step-nome').style.display = 'flex';
  }

  function enviarNome() {
    const nome = document.getElementById('user-name').value.trim();
    if (!nome) return alert('Digite seu nome!');
    userData.nome = nome;
    document.getElementById('step-nome').style.display = 'none';
    document.getElementById('step-whatsapp').style.display = 'flex';
    setTimeout(() => document.getElementById('user-whatsapp').focus(), 100);
  }

  async function enviarWhatsapp() {
    const raw = document.getElementById('user-whatsapp').value.trim();
    const digits = raw.replace(/\D/g, '');
    if (digits.length < 10) return alert('Digite um número válido com DDD!');
    userData.whatsapp = `+55${digits}`;

    const chatlog = document.getElementById('chatlog');
    const bubble = document.createElement("div");
    bubble.className = 'chat-bubble';
    bubble.innerText = `👩‍💼 Andréia: Obrigada! Vou começar seu atendimento agora 😊`;
    chatlog.appendChild(bubble);

    document.getElementById('step-whatsapp').style.display = 'none';
    document.getElementById('chatfooter').style.display = 'flex';

    const loading = document.createElement("div");
    loading.className = 'chat-bubble';
    loading.innerText = 'Andréia está digitando...';
    chatlog.appendChild(loading);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      loading.remove();

      const novaBolha = document.createElement("div");
      novaBolha.className = "chat-bubble";

      const regexWa = /(https:\/\/wa\.me\/[0-9?=]+)/;
      const match = resposta.match(regexWa);
      if (match) {
        const link = match[1];
        const textoSemLink = resposta.replace(link, '').trim();
        novaBolha.innerHTML = `👩‍💼 Andréia: ${textoSemLink}<br>
          <a href="${link}" target="_blank" style="display:inline-block;margin-top:8px;padding:8px 16px;
             background-color:#25D366;color:white;border-radius:8px;text-decoration:none;
             font-weight:600;font-size:14px;">
             💬 Falar no WhatsApp
          </a>`;
      } else {
        novaBolha.innerText = `👩‍💼 Andréia: ${resposta}`;
      }

      chatlog.appendChild(novaBolha);
      chatlog.scrollTop = chatlog.scrollHeight;
    } catch (err) {
      loading.innerText = '❌ Erro ao iniciar atendimento.';
    }
  }

  async function sendChat() {
    const input = document.getElementById('chatinput');
    const message = input.value.trim();
    if (!message) return;

    const chatlog = document.getElementById('chatlog');
    const msgUser = document.createElement("div");
    msgUser.className = 'chat-bubble user';
    msgUser.innerText = message;
    chatlog.appendChild(msgUser);
    input.value = '';
    chatlog.scrollTop = chatlog.scrollHeight;

    const payload = { message, session: userData.session };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      const respostas = Array.isArray(data) ? data : [data];

      for (let i = 0; i < respostas.length; i++) {
        const digitando = document.createElement("div");
        digitando.className = 'chat-bubble';
        digitando.innerText = 'Andréia está digitando...';
        chatlog.appendChild(digitando);
        chatlog.scrollTop = chatlog.scrollHeight;

        await new Promise(res => setTimeout(res, 1000 + i * 300));
        digitando.remove();

        if (texto.trim()) {
          const novaBolha = document.createElement("div");
          novaBolha.className = "chat-bubble";

          const regexWa = /(https:\/\/wa\.me\/[0-9?=]+)/;
          const match = texto.match(regexWa);
          if (match) {
            const link = match[1];
            const textoSemLink = texto.replace(link, '').trim();
            novaBolha.innerHTML = `👩‍💼 Andréia: ${textoSemLink}<br>
              <a href="${link}" target="_blank" style="display:inline-block;margin-top:8px;padding:8px 16px;
                 background-color:#25D366;color:white;border-radius:8px;text-decoration:none;
                 font-weight:600;font-size:14px;">
                 💬 Continuar no WhatsApp
              </a>`;
          } else {
            novaBolha.innerText = `👩‍💼 Andréia: ${texto}`;
          }

          chatlog.appendChild(novaBolha);
          chatlog.scrollTop = chatlog.scrollHeight;
        }
      }
    } catch (err) {
      const erroBolha = document.createElement("div");
      erroBolha.className = "chat-bubble";
      erroBolha.innerText = '❌ Erro ao se comunicar com a IA.';
      chatlog.appendChild(erroBolha);
      chatlog.scrollTop = chatlog.scrollHeight;
    }
  }
})();
