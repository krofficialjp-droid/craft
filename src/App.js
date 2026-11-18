import React, { useState, useEffect } from 'react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login' | 'signup' | 'home' | 'chat' | 'memo' | 'add' | 'settings'
  const [toastMessage, setToastMessage] = useState(null);

  // 認証・登録情報
  const [registeredAuth, setRegisteredAuth] = useState({
    email: '',
    phone: '',
    password: '',
    hasAccount: false
  });

  // ログイン入力
  const [loginIdInput, setLoginIdInput] = useState('');
  const [loginPassInput, setLoginPassInput] = useState('');

  // 新規登録入力
  const [signupEmailInput, setSignupEmailInput] = useState('');
  const [signupPhoneInput, setSignupPhoneInput] = useState('');
  const [signupPassInput, setSignupPassInput] = useState('');

  // プロフィール情報
  const [profile, setProfile] = useState({
    name: 'ゲストユーザー',
    id: 'user_123',
    bio: 'こんにちは！よろしくお願いします。',
    avatar: '😊',
    onlineStatus: 'online',
    personalUrl: 'https://craft.app/u/user_123'
  });

  // タイムライン投稿
  const [posts, setPosts] = useState([
    { id: 'p_1', authorName: 'システム', authorId: 'system', avatar: '🤖', time: '1時間前', text: 'Craftへようこそ！新しいつながりやメモを始めましょう。', tag: 'general', theme: 'default', likes: 2, liked: false, comments: 0, isMine: false }
  ]);
  const [postInputText, setPostInputText] = useState('');
  const [selectedPostTag, setSelectedPostTag] = useState('general');
  const [selectedPostTheme, setSelectedPostTheme] = useState('default');

  // チャット関連
  const [contacts, setContacts] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatTab, setChatTab] = useState('talk'); // 'talk' | 'group'
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  // メモ帳
  const [memos, setMemos] = useState([
    { id: 'm_1', title: '最初のメモ', content: 'ここに大切なメモを保存できます。', body: 'ここに大切なメモを保存できます。', isPinned: true, createdAt: '今日 10:00', updatedAt: '今日 10:00' }
  ]);

  // 設定・セキュリティ
  const [securitySettings, setSecuritySettings] = useState({
    phoneNumber: '+81 90-1234-5678',
    email: 'user@example.com',
    twoFactorEnabled: false,
    twoFactorMethod: 'sms'
  });
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    messages: true,
    calls: true,
    showPreview: true
  });
  const [privacySettings, setPrivacySettings] = useState({
    readReceipts: true,
    allowQrIdSearch: true
  });
  const [storageSettings, setStorageSettings] = useState({
    appSizeGb: 1.2,
    cacheSizeMb: 145,
    autoDownloadWifiOnly: false,
    saveToPhotos: true
  });
  const [activeSessions, setActiveSessions] = useState([
    { id: 's_1', device: 'iPhone 15 (現在の端末)', location: '日本', lastActive: 'たった今', isCurrent: true }
  ]);
  const [blockedUsers, setBlockedUsers] = useState([]);

  // モーダル制御
  const [showPostModal, setShowPostModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [activeSettingModal, setActiveSettingModal] = useState(null);
  const [chatActionModal, setChatActionModal] = useState(null);
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);

  // 入力フォーム用一時ステート
  const [addContactIdInput, setAddContactIdInput] = useState('');
  const [groupNameInput, setGroupNameInput] = useState('');
  const [groupIconEmoji, setGroupIconEmoji] = useState('👥');
  const [groupIconImage, setGroupIconImage] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  
  const [newPhoneInput, setNewPhoneInput] = useState('');
  const [smsCodeSent, setSmsCodeSent] = useState(false);
  const [smsCodeInput, setSmsCodeInput] = useState('');

  const [newEmailInput, setNewEmailInput] = useState('');
  const [emailCurrentPassInput, setEmailCurrentPassInput] = useState('');
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');

  const [deleteConfirmPass, setDeleteConfirmPass] = useState('');
  const [reportReason, setReportReason] = useState('Spam / スパム');
  const [reportedTarget, setReportedTarget] = useState(null);

  const [memoTitleInput, setMemoTitleInput] = useState('');
  const [memoContentInput, setMemoContentInput] = useState('');
  const [memoPinnedInput, setMemoPinnedInput] = useState(false);

  const [callState, setCallState] = useState({ active: false, type: 'voice', targetName: '', avatar: '' });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
    setShowChatMenu(false);
  };

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (activeChatId) {
        setContacts(contacts.map(c => c.id === activeChatId ? {
          ...c, 
          messages: [...c.messages, { sender: 'me', text: `🎙️ ボイスメッセージ (${recordSeconds}秒)` }]
        } : c));
        showToast('ボイスメッセージを送信しました');
      }
    } else {
      setIsRecording(true);
      showToast('ボイスメッセージの録音を開始しました');
    }
  };

  const handleChatPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !activeChatId) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const imgUrl = ev.target.result;
      setContacts(contacts.map(c => c.id === activeChatId ? {
        ...c,
        messages: [...c.messages, { sender: 'me', text: '[画像]', image: imgUrl }]
      } : c));
      showToast('画像を送信しました');
    };
    reader.readAsDataURL(file);
  };

  const handleAddFriend = () => {
    const query = addContactIdInput.trim();
    if (!query) {
      showToast('IDまたはURLを入力してください');
      return;
    }
    if (blockedUsers.some(b => b.id === query || query.includes(b.id))) {
      showToast('このユーザーはブロックリストに含まれています');
      return;
    }
    const targetName = 'フレンド ' + Math.floor(Math.random() * 900 + 100);
    const newId = 'friend_' + Date.now();
    setContacts([...contacts, {
      id: newId,
      name: targetName,
      avatar: '👤',
      online: true,
      isGroup: false,
      isRead: false,
      messages: [{ sender: 'them', text: 'フレンド追加されました！よろしくお願いします！' }]
    }]);
    setAddContactIdInput('');
    showToast(`${targetName} を追加しました！`);
    navigateTo('chat');
  };

  const executeBlockUser = (target) => {
    setBlockedUsers([...blockedUsers, target]);
    setContacts(contacts.filter(c => c.id !== target.id));
    setChatActionModal(null);
    if (activeChatId === target.id) {
      setActiveChatId(null);
    }
    showToast(`${target.name} をブロックしました`);
  };

  const getMaskedPhone = (phone) => {
    if (!phone) return '未設定';
    if (phone.length < 4) return '****';
    return phone.slice(0, 4) + ' **** ' + phone.slice(-4);
  };

  const currentChatPartner = contacts.find(c => c.id === activeChatId);
  const totalStorageGb = (storageSettings.appSizeGb + (storageSettings.cacheSizeMb / 1024)).toFixed(2);

  const ToggleSwitch = ({ checked, onChange, disabled }) => (
    <div 
      onClick={disabled ? undefined : onChange}
      style={{
        width: '44px',
        height: '24px',
        backgroundColor: checked ? '#4f46e5' : '#334155',
        borderRadius: '99px',
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s',
        opacity: disabled ? 0.5 : 1,
        flexShrink: 0
      }}
    >
      <div style={{
        width: '18px',
        height: '18px',
        backgroundColor: '#fff',
        borderRadius: '50%',
        position: 'absolute',
        top: '3px',
        left: checked ? '23px' : '3px',
        transition: 'left 0.2s'
      }} />
    </div>
  );

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      
      {toastMessage && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1e293b', border: '1px solid #4f46e5', color: '#fff', padding: '10px 20px', borderRadius: '99px', fontSize: '13px', fontWeight: 'bold', zIndex: 999, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
          {toastMessage}
        </div>
      )}

      {/* ヘッダー（横並びナビゲーション） */}
      {currentScreen !== 'login' && currentScreen !== 'signup' && (
        <header style={{ height: '60px', backgroundColor: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigateTo('home')}>
            <img src="/IMG_20261118_180242.jpg" alt="Icon" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#fff' }}>Craft</span>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => navigateTo('home')} style={{ backgroundColor: currentScreen === 'home' ? '#4f46e5' : 'transparent', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>ホーム</button>
            <button onClick={() => navigateTo('chat')} style={{ backgroundColor: currentScreen === 'chat' ? '#4f46e5' : 'transparent', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>チャット</button>
            <button onClick={() => navigateTo('memo')} style={{ backgroundColor: currentScreen === 'memo' ? '#4f46e5' : 'transparent', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>メモ帳</button>
            <button onClick={() => navigateTo('add')} style={{ backgroundColor: currentScreen === 'add' ? '#4f46e5' : 'transparent', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>追加</button>
            <button onClick={() => navigateTo('settings')} style={{ backgroundColor: currentScreen === 'settings' ? '#4f46e5' : 'transparent', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>設定</button>
          </nav>
        </header>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        
        {/* ================= 1. ログイン画面 ================= */}
        {currentScreen === 'login' && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#090d16', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
              
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <img src="/IMG_20261118_180242.jpg" alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>ようこそ Craft へ</h1>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>アカウントにログインしてください</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>メールアドレスまたは電話番号</label>
                  <input 
                    type="text" 
                    value={loginIdInput} 
                    onChange={e => setLoginIdInput(e.target.value)} 
                    placeholder="example@email.com" 
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '14px' }} 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>パスワード</label>
                  <input 
                    type="password" 
                    value={loginPassInput} 
                    onChange={e => setLoginPassInput(e.target.value)} 
                    placeholder="••••••••" 
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '14px' }} 
                  />
                </div>

                <button 
                  onClick={() => {
                    if (!loginIdInput.trim() || !loginPassInput.trim()) {
                      showToast('メールアドレス（または電話番号）とパスワードを入力してください');
                      return;
                    }
                    if (registeredAuth.hasAccount) {
                      if (loginIdInput !== registeredAuth.email && loginIdInput !== registeredAuth.phone) {
                        showToast('登録されているメールアドレスまたは電話番号が一致しません');
                        return;
                      }
                      if (loginPassInput !== registeredAuth.password) {
                        showToast('パスワードが正しくありません');
                        return;
                      }
                    } else {
                      setRegisteredAuth({
                        email: loginIdInput,
                        phone: loginIdInput,
                        password: loginPassInput,
                        hasAccount: true
                      });
                      setSecuritySettings(prev => ({ ...prev, email: loginIdInput }));
                    }
                    showToast('ログインしました！');
                    navigateTo('home');
                  }}
                  style={{ width: '100%', padding: '14px', backgroundColor: '#4f46e5', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', marginTop: '4px' }}
                >
                  ログイン
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '13px', color: '#94a3b8' }}>
                <span>アカウントをお持ちではありませんか？</span>
                <button onClick={() => navigateTo('signup')} style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>新規登録</button>
              </div>

            </div>
          </div>
        )}

        {/* ================= 新規登録画面 ================= */}
        {currentScreen === 'signup' && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#090d16', padding: '20px', overflowY: 'auto' }}>
            <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <img src="/IMG_20261118_180242.jpg" alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>新規登録</h1>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>新しいアカウントを作成する</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>メールアドレス</label>
                  <input 
                    type="email" 
                    value={signupEmailInput} 
                    onChange={e => setSignupEmailInput(e.target.value)} 
                    placeholder="example@email.com" 
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '14px' }} 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>電話番号</label>
                  <input 
                    type="tel" 
                    value={signupPhoneInput} 
                    onChange={e => setSignupPhoneInput(e.target.value)} 
                    placeholder="+81 90-1234-5678" 
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '14px' }} 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>パスワード (8文字以上)</label>
                  <input 
                    type="password" 
                    value={signupPassInput} 
                    onChange={e => setSignupPassInput(e.target.value)} 
                    placeholder="8文字以上のパスワード" 
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '14px' }} 
                  />
                </div>

                <button 
                  onClick={() => {
                    if (!signupEmailInput.includes('@') || !signupPhoneInput.trim() || signupPassInput.length < 8) {
                      showToast('有効なメールアドレス、電話番号、8文字以上のパスワードを入力してください');
                      return;
                    }
                    setRegisteredAuth({
                      email: signupEmailInput.trim(),
                      phone: signupPhoneInput.trim(),
                      password: signupPassInput,
                      hasAccount: true
                    });
                    setSecuritySettings(prev => ({
                      ...prev,
                      email: signupEmailInput.trim(),
                      phoneNumber: signupPhoneInput.trim()
                    }));
                    showToast('アカウントを作成しました！ログインしてください。');
                    navigateTo('login');
                  }}
                  style={{ width: '100%', padding: '14px', backgroundColor: '#4f46e5', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', marginTop: '4px' }}
                >
                  アカウントを作成
                </button>
              </div>

              <button onClick={() => navigateTo('login')} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: '13px', textAlign: 'center', fontWeight: 'bold' }}>
                ← ログインへ
              </button>

            </div>
          </div>
        )}

        {/* ================= 2. ホーム画面（横並びレイアウト調整） ================= */}
        {currentScreen === 'home' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '30px', backgroundColor: '#0f172a', overflowY: 'auto', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
              
              {/* プロフィール・タイムラインを横並びに配置可能なフレキシブルコンテナ */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                
                {/* プロフィールカード */}
                <div style={{ flex: '1 1 300px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#0f172a', border: '2px solid #6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
                      {profile.avatar}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{profile.name}</h2>
                      <span style={{ fontSize: '12px', color: '#818cf8', fontFamily: 'monospace' }}>@{profile.id}</span>
                      <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{profile.bio}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowQrModal(true)} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#cbd5e1', padding: '10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>QR表示</button>
                </div>

                {/* タイムライン投稿エリア */}
                <div style={{ flex: '2 1 400px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff' }}>💬 タイムライン</h3>
                    <button onClick={() => setShowPostModal(true)} style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>+ 投稿する</button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '280px', overflowY: 'auto' }}>
                    {posts.map(p => (
                      <div key={p.id} style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '24px' }}>{p.avatar}</span>
                            <div>
                              <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '13px' }}>{p.authorName}</span>
                              <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '8px' }}>{p.time}</span>
                            </div>
                          </div>
                          {p.isMine && (
                            <button onClick={() => setPosts(posts.filter(item => item.id !== p.id))} style={{ background: 'none', border: 'none', color: '#f43f5e', fontSize: '11px', cursor: 'pointer' }}>削除</button>
                          )}
                        </div>
                        <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.4' }}>{p.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ================= 3. チャット画面 ================= */}
        {currentScreen === 'chat' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0f172a' }}>
            {activeChatId === null ? (
              <>
                <header style={{ height: '60px', padding: '0 20px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => navigateTo('home')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px' }}>←</button>
                    <h1 style={{ fontSize: '16px', fontWeight: 'bold' }}>チャット</h1>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setShowGroupModal(true)} style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#818cf8', padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>👥 グループ追加</button>
                    <button onClick={() => setShowContactsModal(true)} style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#cbd5e1', padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>📇 連絡先一覧</button>
                  </div>
                </header>

                <div style={{ display: 'flex', backgroundColor: '#1e293b', borderBottom: '1px solid #334155' }}>
                  <button onClick={() => setChatTab('talk')} style={{ flex: 1, padding: '12px', backgroundColor: chatTab === 'talk' ? '#0f172a' : 'transparent', color: chatTab === 'talk' ? '#818cf8' : '#94a3b8', fontWeight: 'bold', fontSize: '14px', border: 'none', borderBottom: chatTab === 'talk' ? '2px solid #6366f1' : 'none', cursor: 'pointer' }}>
                    💬 トーク ({contacts.filter(c => !c.isGroup).length})
                  </button>
                  <button onClick={() => setChatTab('group')} style={{ flex: 1, padding: '12px', backgroundColor: chatTab === 'group' ? '#0f172a' : 'transparent', color: chatTab === 'group' ? '#818cf8' : '#94a3b8', fontWeight: 'bold', fontSize: '14px', border: 'none', borderBottom: chatTab === 'group' ? '2px solid #6366f1' : 'none', cursor: 'pointer' }}>
                    👥 グループ ({contacts.filter(c => c.isGroup).length})
                  </button>
                </div>

                <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                  <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {contacts.filter(c => chatTab === 'group' ? c.isGroup : !c.isGroup).length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                        <p>{chatTab === 'group' ? 'グループがありません。「グループ追加」から作成してください。' : 'トーク相手がいません。「追加」画面からフレンドを追加してください。'}</p>
                      </div>
                    ) : (
                      contacts.filter(c => chatTab === 'group' ? c.isGroup : !c.isGroup).map(c => {
                        const lastMsg = c.messages[c.messages.length - 1];
                        return (
                          <div key={c.id} onClick={() => setActiveChatId(c.id)} style={{ backgroundColor: '#1e293b', padding: '14px 18px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', border: '1px solid #334155' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <span style={{ fontSize: '26px' }}>{c.avatar}</span>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>{c.name}</span>
                                  {!c.isRead && (
                                    <span style={{ backgroundColor: '#f43f5e', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '99px', fontWeight: 'bold' }}>未読</span>
                                  )}
                                </div>
                                <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginTop: '2px' }}>{lastMsg ? lastMsg.text : ''}</span>
                              </div>
                            </div>
                            <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: 'bold' }}>開く →</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                <header style={{ height: '60px', padding: '0 20px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => setActiveChatId(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px' }}>←</button>
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>{currentChatPartner?.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
                    <button onClick={() => setCallState({ active: true, type: 'voice', targetName: currentChatPartner?.name, avatar: currentChatPartner?.avatar })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }} title="音声通話">
                      📞
                    </button>
                    <button onClick={() => setCallState({ active: true, type: 'video', targetName: currentChatPartner?.name, avatar: currentChatPartner?.avatar })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }} title="ビデオ通話">
                      📹
                    </button>
                    {!currentChatPartner?.isGroup && (
                      <button 
                        onClick={() => setShowChatMenu(!showChatMenu)} 
                        style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', padding: '0 6px' }}
                        title="メニュー"
                      >
                        ︙
                      </button>
                    )}

                    {showChatMenu && !currentChatPartner?.isGroup && (
                      <div style={{ position: 'absolute', top: '42px', right: '0', width: '210px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '14px', boxShadow: '0 10px 25px rgba(0,0,0,0.6)', zIndex: 100, overflow: 'hidden' }}>
                        <button 
                          onClick={() => {
                            setShowChatMenu(false);
                            setChatActionModal('block_confirm');
                          }}
                          style={{ width: '100%', padding: '12px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #334155', color: '#fb7185', fontSize: '13px', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          🚫 ブロックする
                        </button>
                        <button 
                          onClick={() => {
                            setShowChatMenu(false);
                            setReportReason('Spam / スパム');
                            setChatActionModal('report_form');
                          }}
                          style={{ width: '100%', padding: '12px 16px', backgroundColor: 'transparent', border: 'none', color: '#facc15', fontSize: '13px', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          ⚠️ 通報する
                        </button>
                      </div>
                    )}
                  </div>
                </header>
                
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {currentChatPartner?.messages.map((m, idx) => (
                    <div key={idx} style={{ alignSelf: m.sender === 'me' ? 'flex-end' : 'flex-start', backgroundColor: m.sender === 'me' ? '#4f46e5' : '#1e293b', color: '#fff', padding: '10px 16px', borderRadius: '16px', maxWidth: '70%', fontSize: '14px' }}>
                      {m.image && <img src={m.image} alt="uploaded" style={{ maxWidth: '100%', borderRadius: '10px', marginBottom: '6px' }} />}
                      <div>{m.text}</div>
                      {m.sender === 'me' && privacySettings.readReceipts && (
                        <div style={{ fontSize: '10px', color: '#c7d2fe', textAlign: 'right', marginTop: '4px' }}>既読</div>
                      )}
                    </div>
                  ))}
                </div>

                {isRecording && (
                  <div style={{ padding: '10px 20px', backgroundColor: '#7f1d1d', color: '#fca5a5', fontSize: '12px' }}>
                    <span>🔴 ボイスメッセージ録音中... ({recordSeconds}秒) もう一度マイクを押すと送信します</span>
                  </div>
                )}

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.target.elements.msg;
                  if (!input.value.trim()) return;
                  const text = input.value;
                  setContacts(contacts.map(c => c.id === activeChatId ? {...c, messages: [...c.messages, {sender: 'me', text}]} : c));
                  input.value = '';
                }} style={{ padding: '16px', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#1e293b' }}>
                  
                  <label htmlFor="chat-photo-input" style={{ cursor: 'pointer', fontSize: '20px', padding: '4px' }} title="写真を送る">
                    📷
                  </label>
                  <input id="chat-photo-input" type="file" accept="image/*" onChange={handleChatPhotoUpload} style={{ display: 'none' }} />

                  <button type="button" onClick={toggleRecording} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '4px' }} title="ボイスメッセージ">
                    🎙️
                  </button>

                  <input name="msg" type="text" placeholder="メッセージを入力..." style={{ flex: 1, padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', outline: 'none' }} />
                  
                  <button type="submit" style={{ padding: '0 20px', backgroundColor: '#4f46e5', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', height: '42px' }}>送信</button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ================= 4. メモ帳画面 ================= */}
        {currentScreen === 'memo' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '30px', backgroundColor: '#0f172a', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', maxWidth: '800px', margin: '0 auto 16px auto', width: '100%' }}>
              <button onClick={() => navigateTo('home')} style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>← ホームへ戻る</button>
              <button onClick={() => {
                setMemoTitleInput('');
                setMemoContentInput('');
                setMemoPinnedInput(false);
                setShowMemoModal(true);
              }} style={{ backgroundColor: '#4f46e5', color: '#fff', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>+ 新規メモ作成</button>
            </div>
            
            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
              <div style={{ marginBottom: '16px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>🔒 プライベートメモ</h1>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>自分用・個人用メモ</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {memos.map(memo => (
                  <div key={memo.id} style={{ padding: '18px', backgroundColor: '#1e293b', border: memo.isPinned ? '1px solid #6366f1' : '1px solid #334155', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px', position: 'relative' }}>
                    {memo.isPinned && (
                      <span style={{ position: 'absolute', top: '12px', right: '14px', fontSize: '11px', backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '2px 8px', borderRadius: '99px', fontWeight: 'bold' }}>📌 ピン留め</span>
                    )}
                    <div>
                      <h3 style={{ fontWeight: 'bold', color: '#fff', fontSize: '15px', paddingRight: memo.isPinned ? '60px' : '0' }}>{memo.title}</h3>
                      <p style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '6px', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{memo.content || memo.body}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#94a3b8', borderTop: '1px solid #334155', paddingTop: '8px' }}>
                      <span>更新: {memo.updatedAt}</span>
                      <button onClick={() => setMemos(memos.filter(m => m.id !== memo.id))} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}>削除</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. 追加画面 ================= */}
        {currentScreen === 'add' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '30px', backgroundColor: '#0f172a', overflowY: 'auto', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '600px' }}>
              <button onClick={() => navigateTo('home')} style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 'bold', cursor: 'pointer', width: 'fit-content', marginBottom: '16px', fontSize: '14px' }}>← ホームへ戻る</button>
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>フレンド追加</h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '20px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>🔗 個人のURL</h3>
                  <input type="text" readOnly value={profile.personalUrl} style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#818cf8', fontSize: '12px', fontFamily: 'monospace' }} />
                  <button onClick={() => { navigator.clipboard.writeText(profile.personalUrl); showToast('URLをコピーしました！'); }} style={{ padding: '10px', backgroundColor: '#4f46e5', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '12px' }}>URLをコピー</button>
                </div>

                <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '20px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>👤 フレンドを追加</h3>
                    <button onClick={() => setShowQrScanner(true)} style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer' }}>📷 QR読み取り</button>
                  </div>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>Craft ID、または共有された個人のURLを貼り付けて追加できます</p>
                  <input 
                    type="text" 
                    value={addContactIdInput} 
                    onChange={e => setAddContactIdInput(e.target.value)} 
                    placeholder="Craft IDまたはURLを入力" 
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#fff', outline: 'none', fontSize: '13px' }} 
                  />
                  <button onClick={handleAddFriend} style={{ width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>チャット相手に追加</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 6. 設定画面 ================= */}
        {currentScreen === 'settings' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '30px', backgroundColor: '#0f172a', overflowY: 'auto', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
              
              <div>
                <button onClick={() => navigateTo('home')} style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginBottom: '12px', padding: 0 }}>← ホームへ戻る</button>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>設定</h1>
              </div>

              {/* 1. アカウント情報 */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #334155', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
                  <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: '#818cf8', letterSpacing: '0.05em' }}>アカウント情報</h2>
                </div>

                <div 
                  onClick={() => {
                    setNewPhoneInput('');
                    setSmsCodeSent(false);
                    setSmsCodeInput('');
                    setActiveSettingModal('phone');
                  }} 
                  style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>📱 電話番号</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', fontFamily: 'monospace' }}>
                      {getMaskedPhone(securitySettings.phoneNumber)}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: 'bold' }}>変更 →</span>
                </div>

                <div 
                  onClick={() => {
                    setNewEmailInput('');
                    setEmailCurrentPassInput('');
                    setEmailVerificationSent(false);
                    setActiveSettingModal('email');
                  }} 
                  style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>✉️ メールアドレス</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                      {securitySettings.email}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: 'bold' }}>変更 →</span>
                </div>

                <div 
                  onClick={() => {
                    setCurrentPassInput('');
                    setNewPassInput('');
                    setConfirmPassInput('');
                    setActiveSettingModal('password');
                  }} 
                  style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>🔑 パスワード変更</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>••••••••••••</div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: 'bold' }}>編集 →</span>
                </div>
              </div>

              {/* 2. 通知設定 */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #334155', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
                  <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: '#818cf8', letterSpacing: '0.05em' }}>通知設定</h2>
                </div>

                <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>🔔 すべての通知</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>アプリ全体のプッシュ通知を一括で切り替えます</div>
                  </div>
                  <ToggleSwitch 
                    checked={notificationSettings.pushNotifications} 
                    onChange={() => {
                      const next = !notificationSettings.pushNotifications;
                      setNotificationSettings({ ...notificationSettings, pushNotifications: next });
                      showToast(next ? 'すべての通知を ON にしました' : 'すべての通知を OFF にしました');
                    }}
                  />
                </div>

                <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: notificationSettings.pushNotifications ? '#fff' : '#64748b' }}>💬 メッセージ通知</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>新着チャット・グループメッセージの通知</div>
                  </div>
                  <ToggleSwitch 
                    disabled={!notificationSettings.pushNotifications}
                    checked={notificationSettings.messages} 
                    onChange={() => setNotificationSettings({ ...notificationSettings, messages: !notificationSettings.messages })}
                  />
                </div>

                <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: notificationSettings.pushNotifications ? '#fff' : '#64748b' }}>📞 着信通知</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>音声・ビデオ通話の着信音やバナー表示</div>
                  </div>
                  <ToggleSwitch 
                    disabled={!notificationSettings.pushNotifications}
                    checked={notificationSettings.calls} 
                    onChange={() => setNotificationSettings({ ...notificationSettings, calls: !notificationSettings.calls })}
                  />
                </div>

                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: notificationSettings.pushNotifications ? '#fff' : '#64748b' }}>👁️ プレビュー表示</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>ロック画面や通知バナーにメッセージ本文を表示します</div>
                  </div>
                  <ToggleSwitch 
                    disabled={!notificationSettings.pushNotifications}
                    checked={notificationSettings.showPreview} 
                    onChange={() => setNotificationSettings({ ...notificationSettings, showPreview: !notificationSettings.showPreview })}
                  />
                </div>
              </div>

              {/* 3. プライバシー＆ブロック一覧 */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #334155', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
                  <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: '#818cf8', letterSpacing: '0.05em' }}>プライバシー・ブロック一覧</h2>
                </div>

                <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>✓ 既読通知</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>メッセージを読んだことを相手に知らせます</div>
                  </div>
                  <ToggleSwitch 
                    checked={privacySettings.readReceipts} 
                    onChange={() => {
                      const next = !privacySettings.readReceipts;
                      setPrivacySettings({ ...privacySettings, readReceipts: next });
                      showToast(next ? '既読通知を ON にしました' : '既読通知を OFF にしました');
                    }}
                  />
                </div>

                <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>🔍 QR・ID検索の許可</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>OFFにすると知らない人からのID・QR検索追加を防ぎます</div>
                  </div>
                  <ToggleSwitch 
                    checked={privacySettings.allowQrIdSearch} 
                    onChange={() => {
                      const next = !privacySettings.allowQrIdSearch;
                      setPrivacySettings({ ...privacySettings, allowQrIdSearch: next });
                      showToast(next ? 'QR・ID検索を許可しました' : 'QR・ID検索をオフにしました');
                    }}
                  />
                </div>

                <div 
                  onClick={() => setActiveSettingModal('blocked_list')}
                  style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>🚫 ブロックリスト</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>現在ブロック中のユーザー ({blockedUsers.length}人) の確認・解除</div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: 'bold' }}>一覧を開く →</span>
                </div>
              </div>

              {/* 4. ストレージ＆データ */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #334155', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
                  <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: '#818cf8', letterSpacing: '0.05em' }}>ストレージ・メディア設定</h2>
                </div>

                <div style={{ padding: '18px 20px', borderBottom: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>💾 ストレージ使用量</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#818cf8', fontFamily: 'monospace' }}>{totalStorageGb} GB</span>
                  </div>

                  <div style={{ width: '100%', height: '10px', backgroundColor: '#0f172a', borderRadius: '99px', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${Math.round((storageSettings.appSizeGb / 5.0) * 100)}%`, backgroundColor: '#4f46e5', height: '100%' }} />
                    <div style={{ width: `${Math.round(((storageSettings.cacheSizeMb / 1024) / 5.0) * 100)}%`, backgroundColor: '#f59e0b', height: '100%' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                    <span>🔵 アプリデータ: {storageSettings.appSizeGb} GB</span>
                    <span>🟡 キャッシュ: {storageSettings.cacheSizeMb} MB</span>
                  </div>

                  <button 
                    onClick={() => {
                      if (storageSettings.cacheSizeMb === 0) {
                        showToast('削除できるキャッシュはありません');
                        return;
                      }
                      setActiveSettingModal('clear_cache');
                    }}
                    style={{ marginTop: '4px', width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#cbd5e1', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    🧹 キャッシュをクリア ({storageSettings.cacheSizeMb} MB)
                  </button>
                </div>

                <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>📶 Wi-Fi接続時のみ自動取得</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>モバイル通信時の写真・動画の自動ダウンロードを制限します</div>
                  </div>
                  <ToggleSwitch 
                    checked={storageSettings.autoDownloadWifiOnly} 
                    onChange={() => {
                      const next = !storageSettings.autoDownloadWifiOnly;
                      setStorageSettings({ ...storageSettings, autoDownloadWifiOnly: next });
                      showToast(next ? 'Wi-Fi接続時のみ自動取得に設定しました' : 'モバイル通信時も自動取得に設定しました');
                    }}
                  />
                </div>

                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>🖼️ カメラロールへの自動保存</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>受信した写真や動画をスマホ本体の写真アプリに自動保存します</div>
                  </div>
                  <ToggleSwitch 
                    checked={storageSettings.saveToPhotos} 
                    onChange={() => {
                      const next = !storageSettings.saveToPhotos;
                      setStorageSettings({ ...storageSettings, saveToPhotos: next });
                      showToast(next ? 'カメラロールへの自動保存を ON にしました' : 'カメラロールへの自動保存を OFF にしました');
                    }}
                  />
                </div>
              </div>

              {/* 5. 二段階認証 */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>🛡️ 二段階認証 (2FA)</h2>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>ログイン時に追加の認証コードを要求して保護します</p>
                  </div>
                  <ToggleSwitch 
                    checked={securitySettings.twoFactorEnabled} 
                    onChange={() => {
                      const nextVal = !securitySettings.twoFactorEnabled;
                      setSecuritySettings({ ...securitySettings, twoFactorEnabled: nextVal });
                      showToast(nextVal ? '二段階認証を ON にしました' : '二段階認証を OFF にしました');
                    }}
                  />
                </div>

                {securitySettings.twoFactorEnabled && (
                  <div style={{ backgroundColor: '#0f172a', padding: '14px', borderRadius: '14px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#cbd5e1' }}>認証方法を選択:</span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#fff' }}>
                      <input 
                        type="radio" 
                        name="2fa_method" 
                        checked={securitySettings.twoFactorMethod === 'sms'} 
                        onChange={() => {
                          setSecuritySettings({ ...securitySettings, twoFactorMethod: 'sms' });
                          showToast('SMSによるコード受信に設定しました');
                        }}
                        style={{ accentColor: '#4f46e5' }}
                      />
                      <span>💬 SMSによるコード受信 ({getMaskedPhone(securitySettings.phoneNumber)})</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#fff' }}>
                      <input 
                        type="radio" 
                        name="2fa_method" 
                        checked={securitySettings.twoFactorMethod === 'app'} 
                        onChange={() => {
                          setSecuritySettings({ ...securitySettings, twoFactorMethod: 'app' });
                          showToast('認証アプリに設定しました');
                        }}
                        style={{ accentColor: '#4f46e5' }}
                      />
                      <span>📲 認証アプリ (Authenticator App)</span>
                    </label>
                  </div>
                )}
              </div>

              {/* 6. セキュリティ＆端末 */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>💻 ログイン中の端末</h2>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Active Sessions</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeSessions.map(session => (
                    <div key={session.id} style={{ backgroundColor: '#0f172a', padding: '12px 14px', borderRadius: '14px', border: session.isCurrent ? '1px solid #4f46e5' : '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{session.device}</span>
                          {session.isCurrent && (
                            <span style={{ fontSize: '10px', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '2px 8px', borderRadius: '99px', fontWeight: 'bold' }}>現在の端末</span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                          {session.location} • {session.lastActive}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {activeSessions.length > 1 && (
                  <button 
                    onClick={() => {
                      setActiveSessions(activeSessions.filter(s => s.isCurrent));
                      showToast('他のすべての端末からログアウトしました');
                    }}
                    style={{ width: '100%', padding: '12px', backgroundColor: 'rgba(244, 63, 94, 0.15)', border: '1px solid #f43f5e', color: '#fb7185', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    🚨 他のすべての端末からログアウト
                  </button>
                )}
              </div>

              {/* 7. ログアウト / アカウント削除 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                <button 
                  onClick={() => setActiveSettingModal('logout_confirm')} 
                  style={{ width: '100%', padding: '14px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center', fontSize: '14px' }}
                >
                  🚪 ログアウト
                </button>

                <button 
                  onClick={() => {
                    setDeleteConfirmPass('');
                    setActiveSettingModal('delete_account');
                  }} 
                  style={{ width: '100%', padding: '14px', backgroundColor: 'rgba(220, 38, 38, 0.12)', border: '1px solid #dc2626', color: '#ef4444', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center', fontSize: '14px' }}
                >
                  🗑️ アカウント削除
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* モーダル類 */}
      {chatActionModal === 'block_confirm' && currentChatPartner && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '380px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px' }}>🚫</div>
            <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#fff' }}>{currentChatPartner.name} をブロックしますか？</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
              ブロックすると、この相手からのメッセージ受信や着信が遮断されます。
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button onClick={() => setChatActionModal(null)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#cbd5e1', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>キャンセル</button>
              <button onClick={() => executeBlockUser(currentChatPartner)} style={{ flex: 1, padding: '12px', backgroundColor: '#e11d48', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>ブロック</button>
            </div>
          </div>
        </div>
      )}

      {chatActionModal === 'report_form' && currentChatPartner && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>⚠️ {currentChatPartner.name} を通報</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>問題の内容を選択してください。運営チームにレポートが送信されます。</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Spam / スパム', 'Harassment / 嫌がらせ・誹謗中傷', 'Inappropriate Content / 不適切な内容', 'Impersonation / なりすまし'].map(reason => (
                <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#0f172a', borderRadius: '12px', border: reportReason === reason ? '1px solid #4f46e5' : '1px solid #334155', cursor: 'pointer', fontSize: '13px', color: '#fff' }}>
                  <input 
                    type="radio" 
                    name="report_reason" 
                    checked={reportReason === reason} 
                    onChange={() => setReportReason(reason)}
                    style={{ accentColor: '#4f46e5' }}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button onClick={() => setChatActionModal(null)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer' }}>キャンセル</button>
              <button 
                onClick={() => {
                  setReportedTarget(currentChatPartner);
                  setChatActionModal('report_done_block_prompt');
                  showToast('通報を受け付けました');
                }} 
                style={{ flex: 1, padding: '12px', backgroundColor: '#eab308', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
              >
                通報を送信
              </button>
            </div>
          </div>
        </div>
      )}

      {chatActionModal === 'report_done_block_prompt' && reportedTarget && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '380px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px' }}>✅</div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>通報が完了しました</h3>
            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
              続けてこのユーザーをブロックしますか？<br />
              <span style={{ color: '#94a3b8', fontSize: '12px' }}>{reportedTarget.name}</span>
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setChatActionModal(null); setReportedTarget(null); }} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer' }}>しない</button>
              <button onClick={() => { executeBlockUser(reportedTarget); setReportedTarget(null); }} style={{ flex: 1, padding: '12px', backgroundColor: '#e11d48', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>ブロックする</button>
            </div>
          </div>
        </div>
      )}

      {activeSettingModal === 'blocked_list' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>🚫 ブロックリスト</h3>
            <div style={{ maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {blockedUsers.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', padding: '24px' }}>現在ブロックしているユーザーはいません</p>
              ) : (
                blockedUsers.map(user => (
                  <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#0f172a', borderRadius: '14px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '22px' }}>{user.avatar}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{user.name}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>@{user.id}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setBlockedUsers(blockedUsers.filter(b => b.id !== user.id));
                        showToast(`${user.name} のブロックを解除しました`);
                      }}
                      style={{ padding: '6px 12px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      解除
                    </button>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setActiveSettingModal(null)} style={{ width: '100%', padding: '10px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>閉じる</button>
          </div>
        </div>
      )}

      {activeSettingModal === 'clear_cache' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '380px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px' }}>🧹</div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>キャッシュの削除</h3>
            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
              {storageSettings.cacheSizeMb}MB のキャッシュを削除しますか？<br />
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>※トーク履歴や個人メモは消去されません</span>
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setActiveSettingModal(null)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer' }}>キャンセル</button>
              <button 
                onClick={() => {
                  const freed = storageSettings.cacheSizeMb;
                  setStorageSettings({ ...storageSettings, cacheSizeMb: 0 });
                  setActiveSettingModal(null);
                  showToast(`${freed}MB のキャッシュを削除しました！`);
                }} 
                style={{ flex: 1, padding: '12px', backgroundColor: '#4f46e5', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSettingModal === 'logout_confirm' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '380px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px' }}>🚪</div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>ログアウトしますか？</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>ログアウトすると現在のセッションが終了し、ログイン画面へ戻ります。</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setActiveSettingModal(null)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer' }}>キャンセル</button>
              <button 
                onClick={() => {
                  setActiveSettingModal(null);
                  showToast('ログアウトしました');
                  navigateTo('login');
                }} 
                style={{ flex: 1, padding: '12px', backgroundColor: '#4f46e5', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSettingModal === 'delete_account' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '410px', backgroundColor: '#1e293b', border: '1px solid #dc2626', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '6px' }}>🚨</div>
              <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#ef4444' }}>アカウント削除</h3>
            </div>
            
            <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.4)', padding: '14px', borderRadius: '14px', fontSize: '12px', color: '#fca5a5', lineHeight: '1.6' }}>
              <strong>警告：</strong>アカウントを削除すると、これまでの<strong>トーク履歴・個人メモ・連絡先・プロフィール情報</strong>がすべて完全に消去され、元に戻すことはできません。
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>本人確認のため現在のパスワードを入力してください</label>
              <input 
                type="password" 
                value={deleteConfirmPass} 
                onChange={e => setDeleteConfirmPass(e.target.value)} 
                placeholder="パスワードを入力..." 
                style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', outline: 'none' }} 
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button onClick={() => setActiveSettingModal(null)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#cbd5e1', borderRadius: '12px', cursor: 'pointer' }}>キャンセル</button>
              <button 
                onClick={() => {
                  if (!deleteConfirmPass.trim()) {
                    showToast('パスワードを入力してください');
                    return;
                  }
                  if (deleteConfirmPass !== registeredAuth.password) {
                    showToast('現在のパスワードが正しくありません');
                    return;
                  }
                  setActiveSettingModal(null);
                  setMemos([]);
                  setContacts([]);
                  setRegisteredAuth({ email: '', phone: '', password: '', hasAccount: false });
                  showToast('アカウントとすべてのデータを完全に削除しました');
                  navigateTo('login');
                }} 
                style={{ flex: 1, padding: '12px', backgroundColor: '#dc2626', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
              >
                完全に削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSettingModal === 'phone' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>📱 電話番号の追加・変更</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>現在登録中の番号: <span style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>{getMaskedPhone(securitySettings.phoneNumber)}</span></p>
            
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>新しい電話番号</label>
              <input 
                type="tel" 
                value={newPhoneInput} 
                onChange={e => setNewPhoneInput(e.target.value)} 
                placeholder="例: +81 90-9876-5432" 
                disabled={smsCodeSent}
                style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', outline: 'none' }} 
              />
            </div>

            {!smsCodeSent ? (
              <button 
                onClick={() => {
                  if (!newPhoneInput.trim()) {
                    showToast('新しい電話番号を入力してください');
                    return;
                  }
                  setSmsCodeSent(true);
                  showToast('SMSに認証コードを送信しました');
                }}
                style={{ width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
              >
                SMSに認証コードを送信
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#0f172a', padding: '14px', borderRadius: '14px', border: '1px solid #4f46e5' }}>
                <label style={{ fontSize: '12px', color: '#818cf8', fontWeight: 'bold' }}>SMS認証コード（6桁）</label>
                <input 
                  type="text" 
                  maxLength="6"
                  value={smsCodeInput} 
                  onChange={e => setSmsCodeInput(e.target.value)} 
                  placeholder="123456" 
                  style={{ width: '100%', padding: '12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#fff', outline: 'none', letterSpacing: '0.2em', textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }} 
                />
                <button 
                  onClick={() => {
                    if (smsCodeInput.length < 4) {
                      showToast('認証コードを入力してください');
                      return;
                    }
                    setSecuritySettings({ ...securitySettings, phoneNumber: newPhoneInput.trim() });
                    setRegisteredAuth({ ...registeredAuth, phone: newPhoneInput.trim() });
                    setActiveSettingModal(null);
                    showToast('電話番号の認証と更新が完了しました！');
                  }}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#22c55e', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                >
                  認証して変更を確定
                </button>
              </div>
            )}

            <button onClick={() => setActiveSettingModal(null)} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer', fontSize: '13px' }}>キャンセル</button>
          </div>
        </div>
      )}

      {activeSettingModal === 'email' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>✉️ メールアドレスの変更</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>現在のアドレス: <span style={{ color: '#cbd5e1' }}>{securitySettings.email}</span></p>

            {!emailVerificationSent ? (
              <>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>現在のパスワード</label>
                  <input 
                    type="password" 
                    value={emailCurrentPassInput} 
                    onChange={e => setEmailCurrentPassInput(e.target.value)} 
                    placeholder="本人確認のためパスワードを入力" 
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', outline: 'none' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>新しいメールアドレス</label>
                  <input 
                    type="email" 
                    value={newEmailInput} 
                    onChange={e => setNewEmailInput(e.target.value)} 
                    placeholder="new.address@example.com" 
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', outline: 'none' }} 
                  />
                </div>
                <button 
                  onClick={() => {
                    if (!emailCurrentPassInput || !newEmailInput.includes('@')) {
                      showToast('現在のパスワードと有効なメールアドレスを入力してください');
                      return;
                    }
                    if (emailCurrentPassInput !== registeredAuth.password) {
                      showToast('現在のパスワードが正しくありません');
                      return;
                    }
                    setEmailVerificationSent(true);
                    showToast('新しいアドレス宛てに確認メールを送信しました');
                  }}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
                >
                  確認メールを送信する
                </button>
              </>
            ) : (
              <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '14px', border: '1px solid #4f46e5', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                  <strong>{newEmailInput}</strong> 宛てに確認メールを送信しました。<br />メール内のリンクをクリックすると変更が完了します。
                </p>
                <button 
                  onClick={() => {
                    setSecuritySettings({ ...securitySettings, email: newEmailInput.trim() });
                    setRegisteredAuth({ ...registeredAuth, email: newEmailInput.trim() });
                    setActiveSettingModal(null);
                    showToast('メールアドレスの認証が完了しました！');
                  }}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#22c55e', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '12px' }}
                >
                  確認リンクをクリックして完了する
                </button>
              </div>
            )}

            <button onClick={() => setActiveSettingModal(null)} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer', fontSize: '13px' }}>キャンセル</button>
          </div>
        </div>
      )}

      {activeSettingModal === 'password' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>🔑 パスワード変更</h3>
            
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>現在のパスワード</label>
              <input type="password" value={currentPassInput} onChange={e => setCurrentPassInput(e.target.value)} placeholder="現在のパスワード" style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', outline: 'none' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>新しいパスワード</label>
              <input type="password" value={newPassInput} onChange={e => setNewPassInput(e.target.value)} placeholder="8文字以上の新しいパスワード" style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', outline: 'none' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>新しいパスワード（確認用）</label>
              <input type="password" value={confirmPassInput} onChange={e => setConfirmPassInput(e.target.value)} placeholder="もう一度入力してください" style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', outline: 'none' }} />
            </div>

            <button 
              onClick={() => {
                if (!currentPassInput || !newPassInput) {
                  showToast('すべての項目を入力してください');
                  return;
                }
                if (currentPassInput !== registeredAuth.password) {
                  showToast('現在のパスワードが正しくありません');
                  return;
                }
                if (newPassInput.length < 8) {
                  showToast('新しいパスワードは8文字以上で入力してください');
                  return;
                }
                if (newPassInput !== confirmPassInput) {
                  showToast('新しいパスワード（確認用）が一致しません');
                  return;
                }
                setRegisteredAuth({ ...registeredAuth, password: newPassInput });
                setActiveSettingModal(null);
                showToast('パスワードを変更しました！');
              }}
              style={{ width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
            >
              パスワードを更新する
            </button>

            <button onClick={() => setActiveSettingModal(null)} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer', fontSize: '13px' }}>キャンセル</button>
          </div>
        </div>
      )}

      {/* 新規メモ作成モーダル */}
      {showMemoModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>📝 新規メモ作成</h3>
              <button onClick={() => {
                if (!memoTitleInput.trim()) {
                  showToast('タイトルを入力してください');
                  return;
                }
                const nowStr = '今日 ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const newMemo = {
                  id: 'memo_' + Date.now(),
                  title: memoTitleInput.trim(),
                  content: memoContentInput.trim(),
                  body: memoContentInput.trim(),
                  isPinned: memoPinnedInput,
                  createdAt: nowStr,
                  updatedAt: nowStr
                };
                setMemos([newMemo, ...memos]);
                setShowMemoModal(false);
                showToast('メモを作成しました');
              }} style={{ padding: '6px 16px', backgroundColor: '#4f46e5', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px' }}>
                保存
              </button>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>タイトル</label>
              <input type="text" value={memoTitleInput} onChange={e => setMemoTitleInput(e.target.value)} placeholder="メモのタイトル..." style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '14px' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>本文</label>
              <textarea value={memoContentInput} onChange={e => setMemoContentInput(e.target.value)} rows="4" placeholder="ここにメモの本文を入力..." style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '14px', resize: 'none' }}></textarea>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0f172a', padding: '12px', borderRadius: '12px', border: '1px solid #334155' }}>
              <span style={{ fontSize: '13px', color: '#fff' }}>ピン留めする</span>
              <input type="checkbox" checked={memoPinnedInput} onChange={e => setMemoPinnedInput(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#4f46e5', cursor: 'pointer' }} />
            </div>

            <button onClick={() => setShowMemoModal(false)} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer', fontSize: '13px' }}>キャンセル</button>
          </div>
        </div>
      )}

      {/* 通話モーダル */}
      {callState.active && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: '#090d16', zIndex: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '50px 20px' }}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '40px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#1e293b', border: '3px solid #6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px' }}>
              {callState.avatar}
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{callState.targetName}</h2>
            <p style={{ fontSize: '13px', color: '#34d399' }}>{callState.type === 'video' ? '📹 ビデオ通話中...' : '📞 音声通話中...'}</p>
          </div>

          <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
            <button onClick={() => setCallState({ active: false })} style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f43f5e', color: '#fff', border: 'none', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(244,63,94,0.4)' }}>
              📞
            </button>
          </div>
        </div>
      )}

      {/* 投稿モーダル */}
      {showPostModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '450px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>新しい投稿</h3>
            <textarea value={postInputText} onChange={e => setPostInputText(e.target.value)} rows="4" placeholder="いまどうしてる？アイデアをシェアしよう..." style={{ width: '100%', padding: '14px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '14px', color: '#fff', outline: 'none', resize: 'none' }}></textarea>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowPostModal(false)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer' }}>キャンセル</button>
              <button onClick={() => {
                if (!postInputText.trim()) return;
                setPosts([{ id: 'p_' + Date.now(), authorName: profile.name, authorId: profile.id, avatar: profile.avatar, time: 'たった今', text: postInputText, tag: selectedPostTag, theme: selectedPostTheme, likes: 0, liked: false, comments: 0, isMine: true }, ...posts]);
                setPostInputText('');
                setShowPostModal(false);
                showToast('投稿をシェアしました！');
              }} style={{ flex: 1, padding: '12px', backgroundColor: '#4f46e5', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>投稿する</button>
            </div>
          </div>
        </div>
      )}

      {/* QR表示モーダル */}
      {showQrModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '320px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontWeight: 'bold', color: '#fff' }}>マイQRコード</h3>
            <div style={{ width: '160px', height: '160px', backgroundColor: '#fff', margin: '0 auto', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#000', fontWeight: 'bold' }}>[QRコード画像]</div>
            <p style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', wordBreak: 'break-all' }}>{profile.personalUrl}</p>
            <button onClick={() => setShowQrModal(false)} style={{ padding: '10px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>閉じる</button>
          </div>
        </div>
      )}

      {/* 連絡先一覧モーダル */}
      {showContactsModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '380px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>📇 連絡先一覧</h3>
            <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {contacts.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', padding: '20px' }}>連絡先がありません</p>
              ) : (
                contacts.map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', backgroundColor: '#0f172a', borderRadius: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{c.avatar}</span>
                    <div>
                      <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px', display: 'block' }}>{c.name}</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>@{c.id}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setShowContactsModal(false)} style={{ padding: '10px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>閉じる</button>
          </div>
        </div>
      )}

      {/* グループ作成モーダル */}
      {showGroupModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>👥 グループ作成</h3>
              <button onClick={() => {
                if (!groupNameInput.trim()) {
                  showToast('グループ名を入力してください');
                  return;
                }
                const gName = groupNameInput.trim();
                const icon = groupIconImage || groupIconEmoji;
                setContacts([...contacts, { 
                  id: 'group_' + Date.now(), 
                  name: gName, 
                  avatar: icon, 
                  online: true, 
                  isGroup: true, 
                  isRead: false, 
                  messages: [{sender: 'them', text: `グループ「${gName}」が作成されました！`, time: 'たった今'}] 
                }]);
                setGroupNameInput('');
                setSelectedMembers([]);
                setGroupIconImage(null);
                setShowGroupModal(false);
                showToast('グループを作成しました！');
              }} style={{ padding: '6px 16px', backgroundColor: '#4f46e5', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px' }}>
                作成
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: '#0f172a', padding: '12px', borderRadius: '16px', border: '1px solid #334155' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#1e293b', border: '2px solid #6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', overflow: 'hidden' }}>
                {groupIconImage ? <img src={groupIconImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : groupIconEmoji}
              </div>
              <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                <label htmlFor="group-photo-file" style={{ flex: 1, padding: '8px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#cbd5e1', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', cursor: 'pointer' }}>
                  📷 写真から選択
                </label>
                <input id="group-photo-file" type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    setGroupIconImage(ev.target.result);
                    showToast('グループ画像を設定しました');
                  };
                  reader.readAsDataURL(file);
                }} style={{ display: 'none' }} />

                <button type="button" onClick={() => {
                  const emojis = ['👥', '🚀', '⭐', '💻', '🎨', '🔥', '🎉'];
                  const next = emojis[(emojis.indexOf(groupIconEmoji) + 1) % emojis.length];
                  setGroupIconEmoji(next);
                  setGroupIconImage(null);
                }} style={{ padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#cbd5e1', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                  😊 絵文字変更
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>グループ名</label>
              <input type="text" value={groupNameInput} onChange={e => setGroupNameInput(e.target.value)} placeholder="例: 開発チーム、仲良しグループ" style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '14px' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>メンバーを選択</label>
              <div style={{ maxHeight: '160px', overflowY: 'auto', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {contacts.filter(c => !c.isGroup).length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', padding: '16px' }}>追加できる連絡先がありません</p>
                ) : (
                  contacts.filter(c => !c.isGroup).map(c => {
                    const isSelected = selectedMembers.includes(c.id);
                    return (
                      <div key={c.id} onClick={() => {
                        if (isSelected) {
                          setSelectedMembers(selectedMembers.filter(id => id !== c.id));
                        } else {
                          setSelectedMembers([...selectedMembers, c.id]);
                        }
                      }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.2)' : '#1e293b', borderRadius: '10px', cursor: 'pointer', border: isSelected ? '1px solid #4f46e5' : '1px solid transparent' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '18px' }}>{c.avatar}</span>
                          <span style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold' }}>{c.name}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: isSelected ? '#4ade80' : '#64748b' }}>{isSelected ? '✓ 選択中' : '＋ 選択'}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <button onClick={() => setShowGroupModal(false)} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '12px', cursor: 'pointer', fontSize: '13px' }}>キャンセル</button>
          </div>
        </div>
      )}

      {/* QRスキャナーモーダル */}
      {showQrScanner && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: '#090d16', zIndex: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '30px' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#818cf8' }}>📷 QRコードスキャナー</span>
            <button onClick={() => setShowQrScanner(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ width: '240px', height: '240px', border: '2px dashed #6366f1', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
            ここにQRコードを合わせてください
          </div>
          <button onClick={() => {
            setShowQrScanner(false);
            const friendId = 'friend_' + Date.now();
            const friendName = '新規フレンド';
            if (!contacts.some(c => c.name === friendName)) {
              setContacts([...contacts, { id: friendId, name: friendName, avatar: '👤', online: true, isGroup: false, isRead: false, messages: [{sender: 'them', text: 'QRコード読み取りで追加されました！よろしくね✨', time: 'たった今'}] }]);
            }
            showToast('フレンドを追加しました！');
            navigateTo('chat');
          }} style={{ width: '100%', maxWidth: '280px', padding: '14px', backgroundColor: '#4f46e5', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '14px', cursor: 'pointer' }}>QRコードをスキャンして追加</button>
        </div>
      )}

    </div>
  );
}