import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/theme-context';

const ThemeButton = () => {
  const { toggleTheme } = useTheme();
  return (
    <StyledWrapper>
      <label className="theme-switch">
        <input
          type="checkbox"
          className="theme-switch__checkbox"
          onChange={toggleTheme}
        />
        <div className="theme-switch__container">
          <div className="theme-switch__circle-container">
            <div className="theme-switch__sun-moon-container">
              <div className="theme-switch__moon">
                <div className="theme-switch__spot" />
                <div className="theme-switch__spot" />
                <div className="theme-switch__spot" />
              </div>
            </div>
          </div>
        </div>
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .theme-switch {
    --toggle-size: 16px; /* Reduced from 30px */
    --container-width: 3em;
    --container-height: 1.5em;
    --circle-container-diameter: 1.8em;
    --sun-moon-diameter: 1.2em;
    --container-light-bg: #3D7EAE;
    --container-night-bg: #1D1F2C;
    --sun-bg: #ECCA2F;
    --moon-bg: #C4C9D1;
    --spot-color: #959DB1;
    --transition: .3s ease;
  }

  .theme-switch, 
  .theme-switch *, 
  .theme-switch *::before, 
  .theme-switch *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-size: var(--toggle-size);
  }

  .theme-switch__container {
    width: var(--container-width);
    height: var(--container-height);
    background-color: var(--container-light-bg);
    border-radius: 6.25em;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: var(--transition);
  }

  .theme-switch__checkbox {
    display: none;
  }

  .theme-switch__circle-container {
    width: var(--circle-container-diameter);
    height: var(--circle-container-diameter);
    background-color: rgba(255, 255, 255, 0.1);
    position: absolute;
    left: 0.15em;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    display: flex;
    transition: var(--transition);
  }

  .theme-switch__sun-moon-container {
    width: var(--sun-moon-diameter);
    height: var(--sun-moon-diameter);
    margin: auto;
    border-radius: 50%;
    background-color: var(--sun-bg);
    box-shadow: 
      inset 1px 1px 1px rgba(254, 255, 239, 0.61),
      inset 0 -1px 1px #a1872a;
    overflow: hidden;
    transition: var(--transition);
  }

  .theme-switch__moon {
    transform: translateX(100%);
    width: 100%;
    height: 100%;
    background-color: var(--moon-bg);
    border-radius: inherit;
    box-shadow: 
      inset 1px 1px 1px rgba(254, 255, 239, 0.61),
      inset 0 -1px 1px #969696;
    transition: var(--transition);
    position: relative;
  }

  .theme-switch__spot {
    position: absolute;
    background-color: var(--spot-color);
    border-radius: 50%;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.25);
  }

  .theme-switch__spot:nth-of-type(1) {
    width: 0.4em;
    height: 0.4em;
    top: 0.2em;
    left: 0.1em;
  }

  .theme-switch__spot:nth-of-type(2) {
    width: 0.2em;
    height: 0.2em;
    top: 0.5em;
    left: 0.7em;
  }

  .theme-switch__spot:nth-of-type(3) {
    width: 0.15em;
    height: 0.15em;
    top: 0.1em;
    left: 0.4em;
  }

  /* Checked states */
  .theme-switch__checkbox:checked + .theme-switch__container {
    background-color: var(--container-night-bg);
  }

  .theme-switch__checkbox:checked + .theme-switch__container .theme-switch__circle-container {
    left: calc(100% - var(--circle-container-diameter) - 0.15em);
  }

  .theme-switch__checkbox:checked + .theme-switch__container .theme-switch__moon {
    transform: translate(0);
  }
`;

export default ThemeButton;