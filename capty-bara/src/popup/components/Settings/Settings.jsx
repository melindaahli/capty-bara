import { useState } from 'react';
import styles from './Settings.module.css';
import Select from 'react-select';
import Toggle from '../Toggle/Toggle';
import capybara from '../../../assets/capybara.png';

export default function Settings() {
    const [fontSize, setFontSize] = useState(16);

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
    const [fontFamily, setFontFamily] = useState(fonts[0]);
    const formatFontOption = (option) => (
        <span style={{ fontFamily: option.fontFamily }}>{option.label}</span>
    );

    const colors = [
        { value: 'White', label: 'White', hex: '#FFFFFF' },
        { value: 'Black', label: 'Black', hex: '#000000' },
        { value: 'Gray', label: 'Gray', hex: '#808080' }
    ];
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

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSideBySide, setIsSideBySide] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <div className={styles.panel}>
            <nav className={styles.nav}>
                <div className={styles.section}>
                    <label className={styles.sectionLabel}>LANGUAGES</label>
                    <p className={styles.description}>language 1</p>
                    <Select options={languages} menuPlacement="auto" maxMenuHeight={155}/>
                    <p className={styles.description}>language 2</p>
                    <Select options={languages} menuPlacement="auto" maxMenuHeight={155}/>
                </div>
                <div className={styles.section}>
                    <label className={styles.sectionLabel}>DISPLAY</label>
                    <p className={styles.description}>caption display</p>
                    <Toggle 
                        id="caption"
                        label="adjacent"
                        rightLabel="stacked"
                        checked={isSideBySide}
                        onChange={setIsSideBySide}
                    />
                    <p className={styles.description}>appearance</p>
                    <Toggle 
                        id="appearance"
                        label="light"
                        rightLabel="dark"
                        checked={isDarkMode}
                        onChange={setIsDarkMode}
                    />
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
                                    onChange={(option) => option && setFontFamily(option)}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.description}>Font Color</label>
                                <Select options={colors} menuPlacement="auto" maxMenuHeight={155} formatOptionLabel={formatColorOption}/>
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
                                        onChange={(e) => setFontSize(Number(e.target.value))}
                                        className={styles.slider}
                                        style={{ '--capybara-url': `url(${capybara})` }}
                                    />
                                    <span className={styles.bigA}>A</span>
                                </div>  
                            </div>
                            <div className={styles.field}>
                                <label className={styles.description}>Background Color</label>
                                <Select options={colors} menuPlacement="auto" maxMenuHeight={155} formatOptionLabel={formatColorOption}/>
                            </div>
                            <div className={styles.field}>
                                <label className={styles.description}>Window Color</label>
                                <Select options={colors} menuPlacement="auto" maxMenuHeight={155} formatOptionLabel={formatColorOption}/>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}