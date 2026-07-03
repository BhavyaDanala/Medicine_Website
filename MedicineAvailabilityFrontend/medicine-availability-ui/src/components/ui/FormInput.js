import styled from 'styled-components';
import { theme } from '../../styles/theme';

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.darkerGray};
  font-family: ${theme.fonts.primary};
`;

const Input = styled.input`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border: 2px solid ${theme.colors.mediumGray};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.md};
  font-family: ${theme.fonts.primary};
  transition: all ${theme.transitions.normal};
  background: ${theme.colors.white};
  color: ${theme.colors.darkerGray};

  &::placeholder {
    color: ${theme.colors.darkGray};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 4px ${theme.colors.primaryLighter};
  }

  &:hover {
    border-color: ${theme.colors.darkGray};
  }

  ${({ $isValid }) => !$isValid && `
    border-color: ${theme.colors.error} !important;

    &:focus {
      border-color: ${theme.colors.error} !important;
      box-shadow: 0 0 0 4px ${theme.colors.errorLighter} !important;
    }
  `}

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;

const TextArea = styled.textarea`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border: 2px solid ${theme.colors.mediumGray};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.md};
  font-family: ${theme.fonts.primary};
  transition: all ${theme.transitions.normal};
  resize: vertical;
  min-height: 100px;
  background: ${theme.colors.white};
  color: ${theme.colors.darkerGray};

  &::placeholder {
    color: ${theme.colors.darkGray};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 4px ${theme.colors.primaryLighter};
  }

  &:hover {
    border-color: ${theme.colors.darkGray};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;

const Select = styled.select`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border: 2px solid ${theme.colors.mediumGray};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.md};
  font-family: ${theme.fonts.primary};
  transition: all ${theme.transitions.normal};
  background: ${theme.colors.white};
  color: ${theme.colors.darkerGray};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 4px ${theme.colors.primaryLighter};
  }

  &:hover {
    border-color: ${theme.colors.darkGray};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.sm};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;

function FormInput({ label, type = 'text', value, onChange, placeholder, required = false, min, max, step, maxLength, isValid = true }) {
  return (
    <FormGroup>
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        maxLength={maxLength}
        $isValid={isValid}
      />
    </FormGroup>
  );
}

function FormTextArea({ label, value, onChange, placeholder, required = false }) {
  return (
    <FormGroup>
      <Label>{label}</Label>
      <TextArea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </FormGroup>
  );
}

function FormSelect({ label, value, onChange, children, required = false }) {
  return (
    <FormGroup>
      <Label>{label}</Label>
      <Select value={value} onChange={onChange} required={required}>
        {children}
      </Select>
    </FormGroup>
  );
}

export { FormInput, FormTextArea, FormSelect };
