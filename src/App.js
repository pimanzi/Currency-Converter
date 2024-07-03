// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useCallback, useEffect, useState } from 'react';

export default function App() {
  const [fromCurrency, setFromCurrency] = useState('');

  const [toCurrency, setToCurrency] = useState('');

  const [amount, setAmount] = useState(1);

  const [output, setOutput] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchData() {
        if (!amount || !toCurrency || !fromCurrency) return setOutput(0);
        if (toCurrency === fromCurrency) {
          setOutput(amount);
          return;
        }

        try {
          setIsLoading(true);

          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error('Not Found');

          const data = await res.json();

          setOutput(data.rates[toCurrency]);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      fetchData();
    },
    [amount, fromCurrency, toCurrency]
  );
  return (
    <div>
      <h1>Currency Converter</h1>
      <UserAmount amount={amount} setAmount={setAmount}></UserAmount>
      <CurrencySelection currency={fromCurrency} setCurrency={setFromCurrency}>
        {' '}
        <option value="" disabled>
          Original Currency
        </option>
      </CurrencySelection>
      <CurrencySelection currency={toCurrency} setCurrency={setToCurrency}>
        {' '}
        <option value="" disabled>
          Derived Currency
        </option>
      </CurrencySelection>

      {isLoading && <Loader></Loader>}
      {error && <Error></Error>}
      {!isLoading && !error && (
        <Output
          output={output}
          toCurrency={toCurrency}
          fromCurrency={fromCurrency}
          amount={amount}
        ></Output>
      )}
    </div>
  );
}

function UserAmount({ amount, setAmount }) {
  return (
    <input
      type="text"
      value={isNaN(Number(amount)) ? 0 : amount}
      onChange={(e) => {
        setAmount(Number(e.target.value));
      }}
    />
  );
}

function CurrencySelection({ children, currency, setCurrency }) {
  return (
    <select
      value={currency}
      onChange={(e) => {
        setCurrency(e.target.value);
      }}
    >
      {children}
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="CAD">CAD</option>
      <option value="INR">INR</option>
    </select>
  );
}

function Loader() {
  return (
    <>
      <p>processing result ....</p>
    </>
  );
}

function Error({ error }) {
  return <p className="loader">Error {error} occured</p>;
}

function Output({ output, toCurrency, fromCurrency, amount }) {
  return (
    <p className="output">
      {output
        ? `The amount of ${amount} in ${fromCurrency} to ${toCurrency} is ${output} ${toCurrency} `
        : 'Type in amount you want to convert'}
    </p>
  );
}
