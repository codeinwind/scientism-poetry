import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    InputAdornment,
    IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';
import authService from '../services/authService';

const PasswordStrengthIndicator = ({ password }) => {
    const { t } = useTranslation();

    const getStrength = (pw) => {
        if (pw.length === 0) return 0;
        let strength = 0;
        if (pw.length >= 8) strength++;
        if (pw.match(/[A-Z]/)) strength++;
        if (pw.match(/[0-9]/)) strength++;
        if (pw.match(/[^A-Za-z0-9]/)) strength++;
        return strength;
    };

    const strength = getStrength(password);

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                {[...Array(4)].map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            height: 8,
                            flex: 1,
                            borderRadius: 1,
                            bgcolor: i < strength ? 'success.main' : 'grey.300',
                        }}
                    />
                ))}
            </Box>
            <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                {t('auth:resetPassword.passwordCriteria')}
            </Typography>
        </Box>
    );
};

export default function ResetPasswordPage() {
    const { t } = useTranslation(['auth', 'common']);
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // The persistent data in localStorage is cleared
    useEffect(() => {
        if (success) {
            localStorage.removeItem('persist:root');
        }
    }, [success]);

    // Verify token validity
    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await authService.validateResetToken(token);
                setTokenValid(response.valid);
            } catch (err) {
                setError(t('auth:resetPassword.errorInvalidToken'));
            } finally {
                setLoading(false);
            }
        };
        validateToken();
    }, [token, t]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError(t('auth:resetPassword.errorMismatch'));
        }

        try {
            const { success: resetSuccess, message } = await authService.resetPassword(
                token,
                password
            );
            if (resetSuccess) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(message);
            }
        } catch (err) {
            setError(err.message || t('auth:resetPassword.errorGeneric'));
        }
    };

    if (loading) {
        return (
            <Container maxWidth="sm">
                <Box sx={{ mt: 8, textAlign: 'center' }}>
                    <Typography variant="body1">
                        {t('auth:resetPassword.validatingToken')}
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (!tokenValid) {
        return (
            <Container maxWidth="sm">
                <Box sx={{ mt: 8 }}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {t('auth:resetPassword.invalidToken')}
                        </Alert>
                        <Button
                            variant="text"
                            color="primary"
                            onClick={() => navigate('/forgot-password')}
                        >
                            {t('auth:resetPassword.resend')}
                        </Button>
                    </Paper>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        {t('auth:resetPassword.title')}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {t('auth:resetPassword.success')}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            label={t('auth:resetPassword.newPassword')}
                            placeholder={t(
                                'auth:resetPassword.newPasswordPlaceholder',
                                'Enter new password (at least 8 characters)'
                            )}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            disabled={success}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <PasswordStrengthIndicator password={password} />
                        <TextField
                            fullWidth
                            type="password"
                            autoComplete="new-password"
                            label={t('auth:resetPassword.confirmPassword')}
                            placeholder={t('auth:resetPassword.confirmPasswordPlaceholder')}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            margin="normal"
                            required
                            disabled={success}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={success}
                        >
                            {success
                                ? t('auth:resetPassword.resetSuccess')
                                : t('auth:resetPassword.submit')}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
