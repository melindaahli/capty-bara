import styles from './Toggle.module.css';
import capybara from '../../../assets/capybara.png';

export default function Toggle({ id, checked, onChange, disabled, label, rightLabel }) {
  return (
    <div className={styles.togglewrapper}>
      {label && (
        <label htmlFor={id} className={styles.togglesidelabel}>
          {label}
        </label>
      )}
      
      <div className={styles.toggleswitch}>
        <input
          type="checkbox"
          className={styles.togglecheckbox}
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <label
          className={styles.toggleslider}
          htmlFor={id}
          style={{
            '--capybara-url': `url(${capybara})`,
            backgroundColor: checked ? '#2196F3' : '#ccc',
            '--knob-translate': checked ? 'translateX(16px)' : 'translateX(0)',
          }}
        />
      </div>

      {rightLabel && (
        <label htmlFor={id} className={styles.togglesidelabel}>
          {rightLabel}
        </label>
      )}
    </div>
  );
}