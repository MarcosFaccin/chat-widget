(function() {
  // Evita carregar múltiplas vezes
  if (window.chatWidgetLoaded) return;
  window.chatWidgetLoaded = true;

  const AVATAR_URL = "https://assets.zyrosite.com/mnl431l6n6HPgpkZ/gemini_generated_image_yy8wmuyy8wmuyy8w-AoP4eNWqxbC3o7o9.png";
  const WEBHOOK_URL = "https://iddeia-n8n.cloudfy.live/webhook/01e3cc1f-c38f-4351-ab2a-8a5950b8ebdf";
  const INITIAL_RESPONSE = "Pronto! Agora posso te ajudar\nQual serviço você gostaria de conhecer?\n\n- Criação de Sites\n- CRM\n- Automações";

  // CSS
  const styles = `
    * { box-sizing: border-box; }
    #chat-launcher { position: fixed; bottom: 20px; right: 20px; display: flex; align-items: center; background: white; border: 1px solid #ddd; border-radius: 50px; padding: 10px 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); cursor: pointer; z-index: 9999; transition: all 0.3s ease; font-family: 'Segoe UI', sans-serif; }
    #chat-launcher:hover { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25); }
    .chat-avatar img { width: 36px; height: 36px; border-radius: 50%; margin-right: 12px; object-fit: cover; }
    .chat-greeting { display: flex; flex-direction: column; font-size: 14px; color: #333; text-align: left; }
    .chat-greeting strong { font-weight: 600; font-size: 15px; color: #0073e6; }
    #chat-container { position: fixed; bottom: 100px; right: 20px; width: 380px; max-height: 60vh; background: white; border-radius: 16px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.2); overflow: hidden; display: none; flex-direction: column; font-family: 'Segoe UI', sans-serif; z-index: 9999; }
    .chat-header { background: #0073e6; color: white; padding: 16px; font-weight: bold; font-size: 16px; display: flex; align-items: center; justify-content: space-between; }
    .chat-header img { width: 36px; height: 36px; border-radius: 50%; margin-right: 10px; object-fit: cover; }
    .chat-body { padding: 16px; flex: 1; overflow-y: auto; font-size: 14px; display: flex; flex-direction: column; background-color: #fafafa; max-height: 400px; }
    .chat-bubble { background: #f1f1f1; border-radius: 14px; padding: 12px 14px; margin-bottom: 10px; max-width: 85%; font-size: 14px; line-height: 1.4; word-wrap: break-word; }
    .chat-bubble.user { background: #0073e6; color: white; align-self: flex-end; }
    .chat-footer { border-top: 1px solid #eee; padding: 12px; display: flex; gap: 8px; background: #fff; }
    .chat-footer input { flex: 1; padding: 10px 14px; border: 1px solid #ccc; border-radius: 8px; font-size: 14px; }
    .chat-footer button { background: #0073e6; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; }
    .chat-form { display: none; flex-direction: column; gap: 10px; }
    .chat-form input { padding: 10px 14px; border-radius: 8px; border: 1px solid #ccc; font-size: 14px; }
    .chat-form button { margin-top: 12px; padding: 10px 16px; border: none; background: #0073e6; color: white; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; }
    .chat-welcome button { margin-top: 12px; padding: 10px 16px; border: none; background: #0073e6; color: white; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; }
    label { font-weight: 500; font-size: 15px; margin-bottom: 4px; color: #333; display: block; }
    @media (max-width: 480px) {
      #chat-container { width: 90vw; right: 5vw; bottom: 80px; }
    }
  `;

  // HTML
  const html = `
    <div id="chat-launcher" onclick="window.toggleChat()">
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
        <span><img id="header-img" src="${AVATAR_URL}" alt="Avatar" /> Software Play - Bia</span>
        <span style="cursor:pointer; font-size: 20px;" onclick="window.toggleChat()">✖</span>
      </div>

      <div class="chat-body" id="chatlog">
        <div class="chat-bubble chat-welcome">
          <strong>Oi! 👋</strong><br>
          Eu sou a <strong>Bia</strong>, assistente da Software Play. Posso te ajudar com sites, lojas ou tráfego pago.<br>
          <button onclick="window.startChat()">Sim, conversar agora</button>
        </div>

        <div class="chat-form" id="step-nome">
          <label><strong>Qual seu nome?</strong></label>
          <input type="text" id="user-name" placeholder="Digite seu nome..." />
          <button onclick="window.enviarNome()">Continuar</button>
        </div>

        <div class="chat-form" id="step-whatsapp">
          <label><strong>Qual seu WhatsApp (com DDD)?</strong></label>
          <input type="text" id="user-whatsapp" placeholder="Ex: (xx) xxxxx-xxxx" />
          <button onclick="window.enviarWhatsapp()">Iniciar Atendimento</button>
        </div>
      </div>

      <div class="chat-footer" id="chatfooter" style="display: none;">
        <input id="chatinput" type="text" placeholder="Digite sua mensagem..." onkeydown="if(event.key==='Enter'){window.sendChat()}">
        <button onclick="window.sendChat()">Enviar</button>
      </div>
    </div>
  `;

  // Funções globais
  window.userData = { nome: '', whatsapp: '', session: 'softwareplay-usuario' };

  window.toggleChat = function() {
    const chat = document.getElementById('chat-container');
    if (chat) chat.style.display = (chat.style.display === 'flex') ? 'none' : 'flex';
  };

  window.startChat = function() {
    const welcome = document.querySelector('.chat-welcome');
    const stepNome = document.getElementById('step-nome');
    if (welcome) welcome.style.display = 'none';
    if (stepNome) stepNome.style.display = 'flex';
  };

  window.enviarNome = function() {
    const nome = document.getElementById('user-name').value.trim();
    if (!nome) return alert('Digite seu nome!');
    window.userData.nome = nome;
    document.getElementById('step-nome').style.display = 'none';
    document.getElementById('step-whatsapp').style.display = 'flex';
    setTimeout(() => document.getElementById('user-whatsapp').focus(), 100);
  };

  window.enviarWhatsapp = async function() {
    const raw = document.getElementById('user-whatsapp').value.trim();
    const digits = raw.replace(/\D/g, '');
    if (digits.length < 10) return alert('Digite um número válido com DDD!');
    window.userData.whatsapp = `+55${digits}`;

    const chatlog = document.getElementById('chatlog');
    const bubble = document.createElement("div");
    bubble.className = 'chat-bubble';
    bubble.innerText = `👩‍💼 Bia: Obrigada! Vou começar seu atendimento agora 😊`;
    chatlog.appendChild(bubble);

    document.getElementById('step-whatsapp').style.display = 'none';
    document.getElementById('chatfooter').style.display = 'flex';

    const loading = document.createElement("div");
    loading.className = 'chat-bubble';
    loading.innerText = 'Bia está digitando...';
    chatlog.appendChild(loading);
    chatlog.scrollTop = chatlog.scrollHeight;

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(window.userData)
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
        novaBolha.innerHTML = `👩‍💼 Bia: ${textoSemLink}<br>
          <a href="${link}" target="_blank" style="display:inline-block;margin-top:8px;padding:8px 16px;background-color:#25D366;color:white;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">💬 Falar no WhatsApp</a>`;
      } else {
        novaBolha.innerText = `👩‍💼 Bia: ${resposta}`;
      }

      chatlog.appendChild(novaBolha);
      chatlog.scrollTop = chatlog.scrollHeight;
    } catch (err) {
      loading.innerText = '❌ Erro ao iniciar atendimento.';
    }
  };

  window.sendChat = async function() {
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

    const payload = { message, session: window.userData.session };

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
        digitando.innerText = 'Bia está digitando...';
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
            novaBolha.innerHTML = `👩‍💼 Bia: ${textoSemLink}<br>
              <a href="${link}" target="_blank" style="display:inline-block;margin-top:8px;padding:8px 16px;background-color:#25D366;color:white;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">💬 Continuar no WhatsApp</a>`;
          } else {
            novaBolha.innerText = `👩‍💼 Bia: ${texto}`;
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
  };

  // Máscara WhatsApp
  function setupWhatsappMask() {
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
  }

  // Inicializa quando o DOM está pronto
  function init() {
    // Injeta CSS
    const styleTag = document.createElement('style');
    styleTag.textContent = styles;
    document.head.appendChild(styleTag);

    // Injeta HTML
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    // Setup máscara
    setupWhatsappMask();
  }

  // Aguarda DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
