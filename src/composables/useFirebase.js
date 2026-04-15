/**
 * useFirebase.js
 * Firebase Auth + Firestore 雙機即時同步
 *
 * Phase 2: 建立 localStorage-only 橋接層，window.* API 供各 Vue 組件呼叫
 * Phase 3: 將在此處引入 Firebase 模組化 SDK，替換 CDN compat 版本
 */

// ── localStorage helpers ──
const LS = {
  get: (key, dflt = null) => {
    try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? dflt } catch { return dflt }
  },
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val))
}

// ── 狀態 ──
let _cache = { cl: null, memo: null, ledger: null, gifts: null, rate: null, wishlist: null }
let _isAuthorized = false
let _userEmail = null
let _db = null
let _auth = null
let _listenersStarted = false

// Phase 3 will initialize with:
// import { initializeApp } from 'firebase/app'
// import { getFirestore, collection, doc, onSnapshot, setDoc, getDoc, enableIndexedDbPersistence } from 'firebase/firestore'
// import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
// const firebaseConfig = { ... Nagoya project config ... }

// ── canSync ──
function _canSync() { return _isAuthorized && _db !== null }

// ── 寫入 Firestore（Phase 3 填入）──
function _fsSet(docKey, data) {
  if (!_canSync()) return
  // Phase 3: setDoc(doc(_db, 'sync', docKey), { items: data })
}
function _fsSetRate(val) {
  if (!_canSync()) return
  // Phase 3: setDoc(doc(_db, 'sync', 'settings'), { rate: val })
}

// ── 首次遷移：localStorage → Firestore（Phase 3 填入）──
function _migrateKey(docKey, lsKey) {
  // Phase 3:
  // getDoc(doc(_db, 'sync', docKey)).then(snap => {
  //   if (!snap.exists()) {
  //     const lsData = LS.get(lsKey)
  //     if (lsData !== null) setDoc(doc(_db, 'sync', docKey), { items: lsData })
  //   }
  // })
}

// ── 即時監聽（Phase 3 填入）──
function _startListeners() {
  if (_listenersStarted) return
  _listenersStarted = true
  // Phase 3: onSnapshot(doc(_db,'sync','cl'), snap => { ... })
  // 每個 listener 更新 _cache + localStorage + 觸發 Vue 組件刷新
}

// ── window.* API（供 Vue 組件呼叫）──
export function setupFirebaseBridge() {
  // Getters：cache 優先，fallback localStorage
  window.getClData     = () => _cache.cl       ?? LS.get('nagoya_cl',       null)
  window.getMemoData   = () => _cache.memo      ?? LS.get('nagoya_memo',     [])
  window.getLedger     = () => _cache.ledger    ?? LS.get('nagoya_ledger',   [])
  window.getGifts      = () => _cache.gifts     ?? LS.get('nagoya_gifts',    [])
  window.loadWlData    = () => _cache.wishlist  ?? LS.get('nagoya_wishlist', [])

  // Savers：永遠存 localStorage，登入後也寫 Firestore
  window.saveClData = (data) => {
    _cache.cl = data; LS.set('nagoya_cl', data); _fsSet('cl', data)
  }
  window.saveMemoData = (data) => {
    _cache.memo = data; LS.set('nagoya_memo', data); _fsSet('memo', data)
  }
  window.saveLedgerData = (data) => {
    _cache.ledger = data; LS.set('nagoya_ledger', data); _fsSet('ledger', data)
  }
  window.saveGifts = (data) => {
    _cache.gifts = data; LS.set('nagoya_gifts', data); _fsSet('gifts', data)
  }
  window.saveWlData = (data) => {
    _cache.wishlist = data; LS.set('nagoya_wishlist', data); _fsSet('wishlist', data)
  }
  window.saveRate = () => {
    // SettingsModal 直接操作 localStorage，此處確保 Firestore 同步
    const val = localStorage.getItem('nagoya_rate') || '0.215'
    _cache.rate = val; _fsSetRate(val)
  }

  // Auth 狀態查詢（供 SettingsModal 使用）
  window.fbGetAuthStatus = () => _isAuthorized
  window.fbGetUserEmail  = () => _userEmail

  // Auth 操作（Phase 3 填入真實邏輯）
  window.fbLogin = (email, pw) => {
    // Phase 3: signInWithEmailAndPassword(_auth, email, pw).then(...).catch(...)
    // 成功後：_isAuthorized = true; _userEmail = email
    //         _migrateKey(); _startListeners(); window.renderFbAuthStatus()
    // 失敗後：顯示錯誤訊息
    console.warn('[Firebase] 登入功能將在 Phase 3 啟用', email)
    alert('Firebase 同步功能將在 Phase 3 啟用')
    if (typeof window.renderFbAuthStatus === 'function') window.renderFbAuthStatus()
  }

  window.fbLogout = () => {
    // Phase 3: signOut(_auth)
    _isAuthorized = false
    _userEmail = null
    if (typeof window.renderFbAuthStatus === 'function') window.renderFbAuthStatus()
  }

  // Phase 3: 監聽 auth 狀態恢復（自動登入）
  // onAuthStateChanged(_auth, user => {
  //   _isAuthorized = !!user
  //   _userEmail = user?.email ?? null
  //   if (user && !_listenersStarted) {
  //     _migrateKey('cl', 'nagoya_cl'); ...
  //     _startListeners()
  //   }
  //   if (typeof window.renderFbAuthStatus === 'function') window.renderFbAuthStatus()
  // })
}
