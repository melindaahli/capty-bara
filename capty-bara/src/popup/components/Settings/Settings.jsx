import { useState, useEffect } from 'react';
import styles from './Settings.module.css';
import Select from 'react-select';
import Toggle from '../Toggle/Toggle';
import capybara from '../../../assets/capybara.png';

const languages = [
    { value: 'English', label: 'English' },
    { value: 'Chinese', label: '中文 (Chinese)' },
    { value: 'Korean', label: '한국 (Korean)' },
    { value: 'Japanese', label: '日本語 (Japanese)'},
    { value: 'Spanish', label: 'Español (Spanish)' },
    { value: 'French', label: 'Français (French)' }
];

const fonts = [
    { value: 'Arial', label: 'Arial', fontFamily: 'Arial, sans-serif' },
    { value: 'Times New Roman', label: 'Times New Roman', fontFamily: '"Times New Roman", serif' },
    { value: 'Georgia', label: 'Georgia', fontFamily: 'Georgia, serif' },
    { value: 'Courier New', label: 'Courier New', fontFamily: '"Courier New", monospace' },
];

const colors = [
    { value: 'Transparent', label: 'Transparent', hex: null},
    { value: 'White', label: 'White', hex: '#FFFFFF' },
    { value: 'Black', label: 'Black', hex: '#000000' },
    { value: 'Gray', label: 'Gray', hex: '#808080' },
    { value: 'Yellow', label: 'Yellow', hex: '#FFFF00' },
    { value: 'Purple', label: 'Purple', hex: '#5000a0' },
    { value: 'Red', label: 'Red', hex: '#FF0000' },
    { value: 'Green', label: 'Green', hex: '#00FF00' },
    { value: 'Blue', label: 'Blue', hex: '#0000FF' },
];

function save(patch) {
    console.log('SAVING:', patch);
    chrome.storage.sync.set(patch, () => {
        console.log('SAVED successfully');
    });
}

export default function Settings() {
    const [primaryLanguage, setPrimaryLanguage] = useState(null);
    const [secondaryLanguage, setSecondaryLanguage] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSideBySide, setIsSideBySide] = useState(false);
    const [fontFamily, setFontFamily] = useState(fonts[0]);
    const [fontSize, setFontSize] = useState(16);
    const [fontColor, setFontColor] = useState(null);
    const [bgColor, setBgColor] = useState(null);
    const [windowColor, setWindowColor] = useState(null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [captionsEnabled, setCaptionsEnabled] = useState(true);

    useEffect(() => {
        chrome.storage.sync.get([
            'primaryLanguage', 'secondaryLanguage',
            'isDarkMode', 'isSideBySide',
            'fontFamily', 'fontSize',
            'fontColor', 'bgColor', 'windowColor',
            'captionsEnabled',
        ], (result) => {
            console.log('loaded:', result);
            if (result.primaryLanguage !== undefined) setPrimaryLanguage(languages.find(l => l.value === result.primaryLanguage) ?? null);
            if (result.secondaryLanguage !== undefined) setSecondaryLanguage(languages.find(l => l.value === result.secondaryLanguage) ?? null);
            if (result.isDarkMode !== undefined) setIsDarkMode(result.isDarkMode);
            if (result.isSideBySide !== undefined) setIsSideBySide(result.isSideBySide);
            if (result.fontFamily !== undefined) setFontFamily(fonts.find(f => f.value === result.fontFamily) ?? fonts[0]);
            if (result.fontSize !== undefined) setFontSize(result.fontSize);
            if (result.fontColor !== undefined) setFontColor(colors.find(c => c.value === result.fontColor) ?? null);
            if (result.bgColor !== undefined) setBgColor(colors.find(c => c.value === result.bgColor) ?? null);
            if (result.windowColor !== undefined) setWindowColor(colors.find(c => c.value === result.windowColor) ?? null);
            if (result.captionsEnabled !== undefined) setCaptionsEnabled(result.captionsEnabled);
        });
    }, []);

    const formatFontOption = (option) => (
        <span style={{ fontFamily: option.fontFamily }}>{option.label}</span>
    );

    const formatColorOption = (option) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {option.label}
            <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: option.hex,
                border: '1px solid #262626',
                flexShrink: 0,
            }} />
        </div>
    );

    return (
        <div className={styles.panel}>
            <div className={styles.captionToggleRow}>
                <span className={styles.captionToggleLabel}>Captions</span>
                <Toggle
                    id="captionsEnabled"
                    label="off"
                    rightLabel="on"
                    checked={captionsEnabled}
                    onChange={(val) => { setCaptionsEnabled(val); save({ captionsEnabled: val }); }}
                />
            </div>
            <nav className={styles.nav}>
                <div className={styles.section}>
                    <label className={styles.sectionLabel}>LANGUAGES</label>
                    <p className={styles.description}>language 1</p>
                    <Select
                        options={languages}
                        menuPlacement="auto"
                        maxMenuHeight={155}
                        value={primaryLanguage}
                        onChange={(option) => { setPrimaryLanguage(option); save({ primaryLanguage: option?.value }); }}
                    />
                    <p className={styles.description}>language 2</p>
                    <Select
                        options={languages}
                        menuPlacement="auto"
                        maxMenuHeight={155}
                        value={secondaryLanguage}
                        onChange={(option) => { setSecondaryLanguage(option); save({ secondaryLanguage: option?.value }); }}
                    />
                </div>
                <div className={styles.section}>
                    <label className={styles.sectionLabel}>DISPLAY</label>
                    <p className={styles.description}>caption display</p>
                    <Toggle
                        id="caption"
                        label="adjacent"
                        rightLabel="stacked"
                        checked={isSideBySide}
                        onChange={(val) => { setIsSideBySide(val); save({ isSideBySide: val }); }}
                    />
                    {/* <p className={styles.description}>appearance</p>
                    <Toggle
                        id="appearance"
                        label="light"
                        rightLabel="dark"
                        checked={isDarkMode}
                        onChange={(val) => { setIsDarkMode(val); save({ isDarkMode: val }); }}
                    /> */}
                </div>
                <div className={styles.section}>
                    <label
                        className={`${styles.sectionLabel} ${styles.clickable}`}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        ADVANCED SETTINGS {showAdvanced ? '▼' : '▶'}
                    </label>

                    {showAdvanced && (
                        <div className={styles.advancedContent}>
                            <div className={styles.field}>
                                <label className={styles.description}>Font Family</label>
                                <Select
                                    options={fonts}
                                    menuPlacement="auto"
                                    maxMenuHeight={155}
                                    formatOptionLabel={formatFontOption}
                                    value={fontFamily}
                                    onChange={(option) => { if (option) { setFontFamily(option); save({ fontFamily: option.value }); } }}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.description}>Font Color</label>
                                <Select
                                    options={colors}
                                    menuPlacement="auto"
                                    maxMenuHeight={155}
                                    formatOptionLabel={formatColorOption}
                                    value={fontColor}
                                    onChange={(option) => { setFontColor(option); save({ fontColor: option?.value }); }}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.description}>Font Size</label>
                                <div className={styles.fontSizeRow}>
                                    <span className={styles.smallA}>A</span>
                                    <input
                                        type="range"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={fontSize}
                                        onChange={(e) => { const v = Number(e.target.value); setFontSize(v); save({ fontSize: v }); }}
                                        className={styles.slider}
                                        style={{ '--capybara-url': `url(${capybara})` }}
                                    />
                                    <span className={styles.bigA}>A</span>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label className={styles.description}>Background Color</label>
                                <Select
                                    options={colors}
                                    menuPlacement="auto"
                                    maxMenuHeight={155}
                                    formatOptionLabel={formatColorOption}
                                    value={bgColor}
                                    onChange={(option) => { setBgColor(option); save({ bgColor: option?.value }); }}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.description}>Window Color</label>
                                <Select
                                    options={colors}
                                    menuPlacement="auto"
                                    maxMenuHeight={155}
                                    formatOptionLabel={formatColorOption}
                                    value={windowColor}
                                    onChange={(option) => { setWindowColor(option); save({ windowColor: option?.value }); }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}
