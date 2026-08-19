# OSK — redesign strony internetowej ośrodka szkolenia kierowców

## 1. Cel projektu

Celem projektu jest przygotowanie **demonstracyjnej, zmodernizowanej wersji istniejącej strony internetowej ośrodka szkolenia kierowców (OSK)**.

Projekt ma służyć przede wszystkim jako **prezentacja koncepcji dla klienta biznesowego** i pokazać, jak jego obecna strona mogłaby wyglądać po modernizacji.

Nie jest celem stworzenie kompletnej, produkcyjnej wersji strony.

Najważniejsze założenie:

> **Struktura i najważniejsze informacje istniejącej strony mają zostać zachowane, natomiast sposób ich prezentacji, wygląd oraz UX mają zostać zaprojektowane na nowo.**

Treści wykorzystane w demonstracji powinny pochodzić z rzeczywistej strony klienta wskazanej jako źródło.

---

## 2. Zakres MVP

### 2.1. Analiza istniejącej strony

Pierwszym etapem projektu jest analiza wskazanej strony klienta.

Należy:

- przeanalizować strukturę strony,
- stworzyć mapę strony (sitemap),
- zidentyfikować menu główne i dodatkowe,
- zidentyfikować wszystkie istotne podstrony i kategorie,
- zidentyfikować najważniejsze sekcje oraz powtarzalne komponenty,
- zidentyfikować formularze i funkcjonalności interaktywne,
- zidentyfikować integracje zewnętrzne,
- zidentyfikować funkcjonalności wymagające backendu lub innych usług serwerowych,
- określić, które elementy zostaną odtworzone w MVP, a które pozostaną jedynie elementem dokumentacji.

### Dokumentacja analizy

Wyniki analizy powinny zostać zapisane w dokumentacji projektu zgodnie z mechanizmem dokumentacji stosowanym przez framework agentów.

W szczególności analiza powinna dostarczyć dokumenty zawierające:

- mapę strony źródłowej,
- listę podstron i kategorii,
- opis istotnych sekcji strony,
- listę zidentyfikowanych funkcjonalności,
- listę integracji zewnętrznych,
- listę funkcjonalności wymagających backendu lub innych usług,
- wskazanie elementów przeznaczonych do odwzorowania w MVP,
- wskazanie elementów pozostających poza zakresem MVP.

Dokumentacja powinna być podstawą dla kolejnych etapów projektu.

---

## 3. Odwzorowanie struktury

Nowa strona powinna zachować **pełną strukturę informacyjną istniejącej strony**, ale nie musi zawierać kompletnej treści wszystkich podstron.

Oznacza to, że:

- wszystkie istotne strony, kategorie i podstrony powinny zostać uwzględnione w nowej strukturze,
- nawigacja powinna odzwierciedlać zidentyfikowaną strukturę,
- strony znajdujące się niżej w hierarchii mogą zawierać jedynie reprezentacyjną strukturę lub placeholdery,
- pełne, rzeczywiste treści należy przenieść tylko dla najważniejszych stron oraz jednej wybranej ścieżki tematycznej.

Przykładowo:

- strona główna — pełna treść,
- oferta — pełna lub reprezentacyjna treść,
- kontakt — pełna treść,
- informacje o firmie — pełna treść,
- wybrana ścieżka oferty — pełna treść,
- pozostałe podstrony — struktura + reprezentacyjna zawartość/placeholder.

---

## 4. Treści

Treści demonstracyjne powinny być w miarę możliwości kopiowane z aktualnej strony klienta.

Nie należy wymyślać informacji o firmie, ofercie, cenach, adresach, numerach telefonów itp., jeżeli nie znajdują się one w źródłowych materiałach.

Jeżeli dla danej sekcji nie ma dostępnej treści, należy zastosować placeholder lub odnotować brak treści w dokumentacji.

Celem nie jest przygotowanie nowego copywritingu, lecz pokazanie **nowego sposobu prezentacji istniejącej oferty**.

---

## 5. Koncepcja wizualna

Przed rozpoczęciem właściwego projektowania należy określić grupę docelową oraz zaproponować kilka możliwych kierunków wizualnych.

Przykładowo:

- młodzi kierowcy — dynamiczny, nowoczesny i energetyczny styl,
- klienci biznesowi — elegancki, minimalistyczny i profesjonalny styl,
- szeroka grupa odbiorców — przyjazny, przejrzysty i uniwersalny styl.

Agent powinien przed rozpoczęciem implementacji:

1. przeanalizować charakter działalności klienta,
2. określić główne grupy docelowe,
3. zaproponować kilka kierunków wizualnych,
4. krótko opisać zalety każdego kierunku,
5. poprosić użytkownika o wybór kierunku.

Wybrany kierunek powinien następnie zostać zastosowany konsekwentnie w całym projekcie.

---

## 6. Responsive / mobile-first

Strona musi działać poprawnie na:

- urządzeniach mobilnych,
- tabletach,
- komputerach desktopowych.

Projektowanie powinno odbywać się zgodnie z podejściem **mobile-first**.

Poprawność działania i czytelność na urządzeniach mobilnych mają wyższy priorytet niż wersja desktopowa.

---

## 7. Ograniczenia funkcjonalne MVP

MVP powinno być możliwie **proste pod względem architektury i zależności**.

Nie zakłada się potrzeby:

- backendu,
- bazy danych,
- systemu uwierzytelniania,
- systemu kont użytkowników,
- skomplikowanych procesów biznesowych,
- rozbudowanych integracji z systemami zewnętrznymi.

Funkcjonalności wymagające takich mechanizmów nie są częścią MVP. Funkcjonalności poza podstawową prezentacją treści nie powinny być dodawane do MVP bez uzasadnienia i potwierdzenia przez użytkownika.

Decyzje dotyczące technologii, frameworków i stacku technicznego pozostają poza zakresem tego dokumentu i powinny zostać podjęte przez odpowiedni etap/agent odpowiedzialny za dobór technologii.

---

## 8. Funkcjonalności poza zakresem MVP

Poza zakresem MVP znajdują się w szczególności:

- kompletne odtworzenie całej istniejącej strony pod względem funkcjonalnym,
- pełna migracja wszystkich treści,
- backend,
- baza danych,
- systemy logowania i kont użytkowników,
- skomplikowane formularze,
- złożone procesy biznesowe,
- rozbudowane integracje z systemami zewnętrznymi,
- inne funkcjonalności wymagające istotnej infrastruktury lub złożoności.

Jeżeli istniejąca strona posiada takie funkcjonalności, powinny zostać **zidentyfikowane i opisane podczas analizy**, nawet jeżeli nie zostaną zaimplementowane.

Funkcjonalności poza zakresem mogą być przedstawione wizualnie jako element demonstracyjny, ale nie powinny sugerować, że są produkcyjnie działające.

---

## 9. Kryteria sukcesu

MVP uznajemy za zakończone, jeżeli:

1. Istnieje działająca, zmodernizowana wersja strony.
2. Wygląd strony jest spójny z wybranym kierunkiem wizualnym.
3. Nowa strona odwzorowuje strukturę informacyjną strony źródłowej.
4. Najważniejsze strony zawierają rzeczywiste treści zaczerpnięte ze strony klienta.
5. Jedna wybrana ścieżka/podstruktura została przedstawiona bardziej szczegółowo.
6. Strona działa poprawnie na urządzeniach mobilnych i desktopowych.
7. MVP nie wymaga nieuzasadnionej złożoności technicznej.
8. Funkcjonalności znajdujące się poza zakresem MVP zostały zidentyfikowane i odpowiednio udokumentowane.
9. Demo pozwala klientowi ocenić nową koncepcję wizualną, strukturę informacji i sposób prezentacji jego oferty.

---

## 10. Charakter projektu

Projekt należy traktować jako **proof of concept / demonstracyjny redesign**, a nie jako gotową produkcyjną stronę internetową.

Priorytetem jest:

**prezentacja koncepcji → UX → wygląd → struktura informacji → reprezentatywne treści → prostota rozwiązania**

a nie kompletność funkcjonalna rozwiązania produkcyjnego.
