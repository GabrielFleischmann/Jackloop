# 🐍 Preparação do ambiente (Conda + Django + React)

## **1. Criar ambiente virtual Conda**
```bash
conda create -n nome_do_projeto_que_voce_escolher (nesse caso: jackpotapp)
```

## **2. Ativar o ambiente virtual**
```bash
conda activate jackpotapp
```

## **3. Desativar o ambiente virtual**
```bash
conda deactivate
```

---

# 📦 Instalação das Dependências (Com o ambiente ativado)

> **Obs:** Certifique-se de que o ambiente **jackpotapp** está ativado antes de instalar.

## **Instalar o pip via Conda**
```bash
conda install pip
```

## **Dependências do projeto**
```bash
pip install python-decouple
pip install django
pip install oracledb==3.3
pip install djangorestframework
pip install markdown
pip install django-filter
pip install django-cors-headers
conda install Pillow
```

> **Obs:** Para instalar `oracledb`, pode ser necessário baixar o **kit de desenvolvimento C++ do Visual Studio**.

# ⚛️ Configuração do React

> Para rodar o front-end, é necessário ter o **Node.js** instalado em sua máquina.  
> Download: https://nodejs.org/en/download

---

# 🚀 Executar o Front-End

Acesse a pasta do front-end pelo terminal:

```bash
cd jackpotapp
cd frontend
npm run dev
```
