import { Sun, Moon, Type, Globe, Compass } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext.jsx';
import { useTranslate } from '../../i18n/translations.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function Settings() {
  useDocumentTitle('Settings');
  const { theme, fontSize, language, setTheme, setFontSize, setLanguage } = useSettings();
  const t = useTranslate(language);
  const { showToast } = useToast();

  const applyAndToast = (fn) => (value) => {
    fn(value);
    showToast(t('saved'), 'success');
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <h2 style={{ marginBottom: 24 }}>{t('settingsTitle')}</h2>

        <div className="settings-section">
          <div className="settings-label"><Sun size={18} /> {t('theme')}</div>
          <div className="settings-options">
            <button
              className={`settings-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => applyAndToast(setTheme)('light')}
            >
              <Sun size={16} /> {t('light')}
            </button>
            <button
              className={`settings-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => applyAndToast(setTheme)('dark')}
            >
              <Moon size={16} /> {t('dark')}
            </button>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-label"><Type size={18} /> {t('fontSize')}</div>
          <div className="settings-options">
            {['small', 'medium', 'large'].map((size) => (
              <button
                key={size}
                className={`settings-btn ${fontSize === size ? 'active' : ''}`}
                onClick={() => applyAndToast(setFontSize)(size)}
              >
                {t(size)}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-label"><Globe size={18} /> {t('language')}</div>
          <div className="settings-options">
            <button className={`settings-btn ${language === 'en' ? 'active' : ''}`} onClick={() => applyAndToast(setLanguage)('en')}>English</button>
            <button className={`settings-btn ${language === 'ta' ? 'active' : ''}`} onClick={() => applyAndToast(setLanguage)('ta')}>தமிழ்</button>
            <button className={`settings-btn ${language === 'hi' ? 'active' : ''}`} onClick={() => applyAndToast(setLanguage)('hi')}>हिन्दी</button>
          </div>
        </div>
      </div>
      <SettingsStyles />
    </div>
  );
}

function SettingsStyles() {
  return (
    <style>{`
      .settings-page { max-width: 640px; margin: 40px auto; padding: 0 20px; }
      .settings-card { background: var(--color-surface, #fff); border-radius: var(--radius-lg); padding: 32px; box-shadow: var(--shadow-lg); }
      .settings-section { margin-bottom: 28px; }
      .settings-label { display: flex; align-items: center; gap: 8px; font-weight: 600; margin-bottom: 12px; }
      .settings-options { display: flex; gap: 10px; flex-wrap: wrap; }
      .settings-btn {
        display: flex; align-items: center; gap: 6px;
        padding: 10px 16px; border-radius: var(--radius-md, 8px);
        border: 1.5px solid var(--color-border, #ddd);
        background: transparent; cursor: pointer; font-size: 0.9rem;
        color: var(--color-text, #333);
      }
      .settings-btn.active {
        border-color: var(--color-blue); background: var(--color-blue); color: #fff;
      }
    `}</style>
  );
}