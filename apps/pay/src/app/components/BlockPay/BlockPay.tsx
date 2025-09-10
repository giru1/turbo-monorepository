'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
    Container,
    Card,
    CardHeader,
    CardContent,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Button,
    Grid,
    Typography,
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    Link,
    Snackbar,
    Autocomplete,
} from '@mui/material';
import {
    QrCode as QrCodeIcon,
    Download as DownloadIcon,
    Share as ShareIcon,
    Replay as ReplayIcon,
    ContentCopy as ContentCopyIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';

import sberLogo from './images/sber.svg';
import alfaLogo from './images/alfa.svg';
import tinkoffLogo from './images/tinkoff.svg';
import vtbLogo from './images/vtb.svg';
import gazpromLogo from './images/gazprom.svg';

import Image from 'next/image';

// Типы данных
interface Service {
    name: string;
    price: number;
    description: string;
    requiresContract: boolean;
    kbk: string;
    score: string;
}

interface OrgData {
    name: string;
    account: string;
    bankName: string;
    bic: string;
    corrAccount: string;
    inn: string;
    kpp: string;
    kbk: string;
    oktmo: string;
    paymentType: string;
}

interface CurrentService {
    name: string;
    price: number | null;
    requiresContract: boolean;
    fromURL: boolean;
    kbk: string;
    score: string;
}

// Данные организации
const orgData: OrgData = {
    name: "УФК по Оренбургской области (ФГБОУ ВО ОрГМУ Минздрава России,л/с )",
    account: "03214643000000015300",
    bankName: "ОТДЕЛЕНИЕ ОРЕНБУРГ БАНКА РОССИИ//УФК по Оренбургской области",
    bic: "015354008",
    corrAccount: "40102810545370000045",
    inn: "5610042554",
    kpp: "561001001",
    kbk: "00000000000000000130",
    oktmo: "53701000",
    paymentType: "01"
};

// Базовые услуги
const baseServices: Service[] = [
    {
        name: "Обучение",
        price: 0,
        description: "Обучение",
        requiresContract: false,
        kbk: "00000000000000000130",
        score: "20536Х30193"
    },
    {
        name: "Проживание",
        price: 0,
        description: "Проживание в общежитии",
        requiresContract: false,
        kbk: "00000000000000000130",
        score: "20536Х30193"
    },
    {
        name: "Медицинские услуги",
        price: 0,
        description: "Медицинские услуги",
        requiresContract: false,
        kbk: "00000000000000000130",
        score: "20536Х30193"
    },
    {
        name: "Физкультурно-оздоровительные услуги СОЛ «Медик»",
        price: 0,
        description: "Физкультурно-оздоровительные услуги СОЛ «Медик»",
        requiresContract: false,
        kbk: "00000000000000000130",
        score: "20536Х30193"
    },
    {
        name: "Оплата штрафа за неисполнение условий договора",
        price: 0,
        description: "Оплата штрафа за неисполнение условий договора",
        requiresContract: false,
        kbk: "00000000000000000140",
        score: "20536Х30193"
    },
    {
        name: "Возврат перерасчёта по оплате труда",
        price: 0,
        description: "Возврат перерасчёта по оплате труда",
        requiresContract: false,
        kbk: "00000000000000000111",
        score: "20536Х30193"
    },
    {
        name: "Возврат командировочных",
        price: 0,
        description: "Возврат командировочных",
        requiresContract: false,
        kbk: "00000000000000000112",
        score: "20536Х30193"
    }
];

// Компонент формы оплаты
export default function PaymentForm() {
    const [fullName, setFullName] = useState('');
    const [contractNumber, setContractNumber] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [serviceAmount, setServiceAmount] = useState(1000);
    const [customServiceName, setCustomServiceName] = useState('');
    const [customAmount, setCustomAmount] = useState(1000);
    const [qrCodeData, setQrCodeData] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [purpose, setPurpose] = useState('');
    const [amount, setAmount] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [currentService, setCurrentService] = useState<CurrentService>({
        name: "",
        price: null,
        requiresContract: false,
        fromURL: false,
        kbk: orgData.kbk,
        score: '',
    });

    const [fioSuggestions, setFioSuggestions] = useState<any[]>([]);
    const [fioInputValue, setFioInputValue] = useState('');
    const fioTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Функция для получения подсказок ФИО от DaData
    const fetchFioSuggestions = async (query: string) => {
        if (!query || query.length < 2) {
            setFioSuggestions([]);
            return;
        }

        try {
            const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Token ${process.env.NEXT_PUBLIC_DADATA_API_KEY}`
                },
                body: JSON.stringify({ query: query, count: 5 })
            });

            if (response.ok) {
                const data = await response.json();
                setFioSuggestions(data.suggestions || []);
            }
        } catch (error) {
            console.error('Ошибка при получении подсказок DaData:', error);
            setFioSuggestions([]);
        }
    };

    // Обработчик изменения поля ФИО с debounce
    const handleFioChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        setFullName(value);
        setFioInputValue(value);

        // Debounce для избежания слишком частых запросов
        if (fioTimeoutRef.current) {
            clearTimeout(fioTimeoutRef.current);
        }

        fioTimeoutRef.current = setTimeout(() => {
            fetchFioSuggestions(value);
        }, 300);
    };

    // Обработчик выбора подсказки
    const handleFioSelect = (event: React.SyntheticEvent, value: string | null) => {
        if (value) {
            setFullName(value);
            setFioInputValue(value);
            setFioSuggestions([]);
        }
    };

    // Очистка таймера при размонтировании
    useEffect(() => {
        return () => {
            if (fioTimeoutRef.current) {
                clearTimeout(fioTimeoutRef.current);
            }
        };
    }, []);

    const rename = () => {
        return `${orgData.name} ${currentService.score}`;
    }

    const qrCodeRef = useRef<HTMLDivElement>(null);

    // Обработчик изменения услуги
    const handleServiceChange = (event: any) => {
        const serviceName = event.target.value;
        setSelectedService(serviceName);

        if (serviceName === 'manual') {
            return;
        }

        const service = baseServices.find(s => s.name === serviceName);
        if (service) {
            setCurrentService({
                name: service.name,
                price: service.price,
                requiresContract: service.requiresContract,
                fromURL: false,
                kbk: service.kbk,
                score: service.score,
            });

            if (service.price > 0) {
                setServiceAmount(service.price);
            }
        }
    };

    // Показать уведомление
    const showSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    // Закрыть уведомление
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    // Генерация QR-кода
    const generateQR = () => {
        if (!fullName) {
            showSnackbar('Пожалуйста, укажите ФИО плательщика');
            return;
        }

        let serviceName, finalAmount, requiresContract, finalKbk;

        if (currentService.fromURL) {
            serviceName = currentService.name;
            requiresContract = currentService.requiresContract;
            finalAmount = currentService.price === 0 ? serviceAmount : currentService.price;
            finalKbk = currentService.kbk;
        } else {
            if (selectedService === '') {
                showSnackbar('Пожалуйста, выберите услугу');
                return;
            }

            if (selectedService === 'manual') {
                if (!customServiceName) {
                    showSnackbar('Укажите наименование услуги');
                    return;
                }
                serviceName = customServiceName;
                finalAmount = customAmount;
                finalKbk = orgData.kbk;
                requiresContract = false;
            } else {
                const service = baseServices.find(s => s.name === selectedService);
                if (!service) return;

                serviceName = service.name;
                requiresContract = service.requiresContract;
                finalKbk = service.kbk;
                finalAmount = service.price === 0 ? serviceAmount : service.price;
            }
        }

        if (requiresContract && !contractNumber) {
            showSnackbar('Пожалуйста, укажите номер договора');
            return;
        }

        // Формируем назначение платежа
        let purposeText = serviceName;
        if (contractNumber) {
            purposeText += ` (договор ${contractNumber})`;
        }
        purposeText += ` (${fullName})`;

        setPurpose(purposeText);
        setAmount(finalAmount ?? 0);

        // Формируем данные для QR-кода
        const fioParts = fullName.trim().split(/\s+/);
        const paymentData = {
            Name: rename().substring(0, 160),
            PersonalAcc: orgData.account.substring(0, 20),
            BankName: orgData.bankName.substring(0, 45),
            BIC: orgData.bic.substring(0, 9),
            CorrespAcc: orgData.corrAccount.substring(0, 20),
            Sum: (finalAmount! * 100), // в копейках
            Purpose: purposeText.substring(0, 210),
            PayeeINN: orgData.inn.substring(0, 12),
            KPP: orgData.kpp.substring(0, 9),
            PayeeKPP: orgData.kpp.substring(0, 9),
            OKTMO: orgData.oktmo.substring(0, 11),
            CBC: finalKbk.substring(0, 20),
            LastName: fioParts[0] || '',
            FirstName: fioParts[1] || '',
            MiddleName: fioParts[2] || ''
        };

        // Формируем строку в формате ST00012
        const qrData = [
            "ST00012",
            ...Object.entries(paymentData).map(([key, value]) => `${key}=${value}`)
        ].join('|');

        setQrCodeData(qrData);
        setShowResults(true);
    };

    // Скачивание QR-кода
    const downloadQR = () => {
        if (!qrCodeRef.current) return;

        const svg = qrCodeRef.current.querySelector('svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = 'QR-код для оплаты.svg';
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
    };

    // Создание ссылки для поделиться
    const createShareLink = () => {
        let serviceName, finalAmount, requiresContract;

        if (currentService.fromURL) {
            serviceName = currentService.name;
            finalAmount = currentService.price === 0 ? serviceAmount : currentService.price;
            requiresContract = currentService.requiresContract;
        } else {
            if (selectedService === 'manual') {
                serviceName = customServiceName;
                finalAmount = customAmount;
                requiresContract = false;
            } else {
                const service = baseServices.find(s => s.name === selectedService);
                if (!service) return '';

                serviceName = service.name;
                finalAmount = service.price === 0 ? serviceAmount : service.price;
                requiresContract = service.requiresContract;
            }
        }

        const params = new URLSearchParams();
        params.append('service', serviceName);
        params.append('amount', (finalAmount ?? 0).toString());


        if (requiresContract) {
            params.append('contract', contractNumber);
        }

        params.append('fio', fullName);

        return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    };

    // Поделиться ссылкой
    const shareLink = () => {
        const url = createShareLink();
        navigator.clipboard.writeText(url)
            .then(() => {
                showSnackbar('Ссылка скопирована в буфер обмена');
            })
            .catch(err => {
                console.error('Ошибка копирования: ', err);
                showSnackbar('Не удалось скопировать ссылку');
            });
    };

    // Копирование в буфер обмена
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => showSnackbar('Скопировано в буфер обмена'))
            .catch(err => console.error('Ошибка копирования: ', err));
    };

    // Сброс формы
    const resetForm = () => {
        setFullName('');
        setContractNumber('');
        setSelectedService('');
        setServiceAmount(1000);
        setCustomServiceName('');
        setCustomAmount(1000);
        setQrCodeData('');
        setShowResults(false);
        setCurrentService({
            name: "",
            price: null,
            requiresContract: false,
            fromURL: false,
            kbk: orgData.kbk,
            score: '',
        });
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Уведомление */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Карточка с формой */}
            <Card>
                <CardHeader
                    title="Оплата услуг"
                    sx={{ bgcolor: 'primary.main', color: 'white' }}
                />
                <CardContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <Autocomplete
                            freeSolo
                            options={fioSuggestions.map(suggestion => suggestion.value)}
                            value={fullName}
                            inputValue={fioInputValue}
                            onInputChange={(event, newInputValue) => {
                                setFioInputValue(newInputValue);
                            }}
                            onChange={handleFioSelect}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    label="ФИО плательщика"
                                    value={fullName}
                                    onChange={handleFioChange}
                                    margin="normal"
                                    placeholder="Иванов Иван Иванович"
                                />
                            )}
                        />

                        {currentService.requiresContract && (
                            <TextField
                                fullWidth
                                label="Номер договора"
                                value={contractNumber}
                                onChange={(e) => setContractNumber(e.target.value)}
                                margin="normal"
                                placeholder="123-456"
                            />
                        )}

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Услуга</InputLabel>
                            <Select
                                value={selectedService}
                                onChange={handleServiceChange}
                                label="Услуга"
                            >
                                <MenuItem value="">-- Выберите услугу --</MenuItem>
                                {baseServices.map((service) => (
                                    <MenuItem key={service.name} value={service.name}>
                                        {service.description}
                                    </MenuItem>
                                ))}
                                <MenuItem value="manual">Указать вручную</MenuItem>
                            </Select>
                        </FormControl>

                        {selectedService && baseServices.find(s => s.name === selectedService)?.price === 0 && (
                            <TextField
                                fullWidth
                                label="Сумма платежа (руб.)"
                                type="number"
                                value={serviceAmount}
                                onChange={(e) => setServiceAmount(Number(e.target.value))}
                                margin="normal"
                                slotProps={{
                                    htmlInput: {
                                        min: 1,
                                        max: 9999999999999999
                                    }
                                }}
                            />
                        )}

                        {selectedService === 'manual' && (
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Наименование услуги"
                                    value={customServiceName}
                                    onChange={(e) => setCustomServiceName(e.target.value)}
                                    margin="normal"
                                    slotProps={{ htmlInput: {maxLength: 210} }}
                                />
                                <TextField
                                    fullWidth
                                    label="Сумма платежа (руб.)"
                                    type="number"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                                    margin="normal"
                                    slotProps={{
                                        htmlInput: {
                                            min: 1,
                                            max: 9999999999999999
                                        }
                                    }}
                                />
                            </Box>
                        )}

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={generateQR}
                            startIcon={<QrCodeIcon />}
                            sx={{ mt: 3 }}
                        >
                            Получить QR-код для оплаты
                        </Button>
                    </Box>

                    {/* Результаты - QR-код и реквизиты */}
                    {showResults && (
                        <Box sx={{ mt: 4 }}>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box ref={qrCodeRef} sx={{ textAlign: 'center' }}>
                                        {qrCodeData && (
                                            <QRCodeSVG
                                                value={qrCodeData}
                                                size={200}
                                                level="M"
                                                marginSize={4}
                                            />
                                        )}
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            startIcon={<DownloadIcon />}
                                            onClick={downloadQR}
                                        >
                                            Скачать QR-код
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="info"
                                            startIcon={<ShareIcon />}
                                            onClick={shareLink}
                                        >
                                            Поделиться
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            startIcon={<ReplayIcon />}
                                            onClick={resetForm}
                                        >
                                            Начать заново
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Как оплатить
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Войдите в приложение вашего банка и с его помощью отсканируйте QR-код.
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Поддерживается следующими банками:
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            <Image src={sberLogo} alt="СберБанк" height={30} />
                                            <Image src={alfaLogo} alt="Альфа-Банк" height={30} />
                                            <Image src={tinkoffLogo} alt="Тинькофф Банк" height={30} />
                                            <Image src={vtbLogo} alt="ВТБ" height={30} />
                                            <Image src={gazpromLogo} alt="Газпромбанк" height={30} />
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Реквизиты для оплаты */}
                            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    Реквизиты для оплаты
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant="body2">
                                            <strong>Назначение платежа:</strong><br /> {purpose}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant="body2">
                                            <strong>Сумма:</strong> {amount} руб.
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>КБК:</strong> {currentService.kbk}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                {/* Банковские реквизиты */}
                                <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                                    Банковские реквизиты
                                </Typography>
                                <TableContainer component={Paper} sx={{ mt: 2 }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Реквизит</TableCell>
                                                <TableCell>Значение</TableCell>
                                                <TableCell>Действие</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Наименование организации</TableCell>
                                                <TableCell>{rename()}</TableCell>
                                                <TableCell>
                                                    <IconButton size="small" onClick={() => copyToClipboard(rename())}>
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>ИНН</TableCell>
                                                <TableCell>{orgData.inn}</TableCell>
                                                <TableCell>
                                                    <IconButton size="small" onClick={() => copyToClipboard(orgData.inn)}>
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>КПП</TableCell>
                                                <TableCell>{orgData.kpp}</TableCell>
                                                <TableCell>
                                                    <IconButton size="small" onClick={() => copyToClipboard(orgData.kpp)}>
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Расчетный счет</TableCell>
                                                <TableCell>{orgData.account}</TableCell>
                                                <TableCell>
                                                    <IconButton size="small" onClick={() => copyToClipboard(orgData.account)}>
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Наименование банка</TableCell>
                                                <TableCell>{orgData.bankName}</TableCell>
                                                <TableCell>
                                                    <IconButton size="small" onClick={() => copyToClipboard(orgData.bankName)}>
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>БИК</TableCell>
                                                <TableCell>{orgData.bic}</TableCell>
                                                <TableCell>
                                                    <IconButton size="small" onClick={() => copyToClipboard(orgData.bic)}>
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Корреспондентский счет</TableCell>
                                                <TableCell>{orgData.corrAccount}</TableCell>
                                                <TableCell>
                                                    <IconButton size="small" onClick={() => copyToClipboard(orgData.corrAccount)}>
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>КБК</TableCell>
                                                <TableCell>{orgData.kbk}</TableCell>
                                                <TableCell>
                                                    <IconButton size="small" onClick={() => copyToClipboard(orgData.kbk)}>
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>ОКТМО</TableCell>
                                                <TableCell>{orgData.oktmo}</TableCell>
                                                <TableCell>
                                                    <IconButton size="small" onClick={() => copyToClipboard(orgData.oktmo)}>
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Alert severity="info" sx={{ mt: 2 }}>
                                    <Typography variant="body2">
                                        <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                        <strong>К стоимости заказа может быть добавлена комиссия платежной системы или вашего банка.</strong>
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Размер комиссии зависит исключительно от тарифов банка, выпустившего вашу карту
                                    </Typography>
                                </Alert>

                                <Alert severity="info" sx={{ mt: 2 }}>
                                    <Typography variant="body2">
                                        <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                        Для ускорения обработки платежа пришлите квитанцию на почту{' '}
                                        <Link href="mailto:pay@orgma.ru">pay@orgma.ru</Link>
                                    </Typography>
                                </Alert>
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}