/**
 * ARCHANGEL Ω — QUANTUM ARCHITECTURAL BLUEPRINT CORE ENGINE
 * Drives the live quantum telemetry HUD, the central interactive multi-ring canvas reactor,
 * and the scientific formula inspector with KaTeX mathematical formatting.
 */

(function () {
  'use strict';

  // ══════════════════════════════════════════════════════════════════════════
  // 1. DATA MATRIX DE LOS 8 SECTORES ARQUITECTÓNICOS & FÓRMULAS
  // ══════════════════════════════════════════════════════════════════════════

  const SECTORS_DATA = {
    physics: {
      id: 'physics',
      name: 'Física Esotérica & Mecánica Cuántica',
      badge: 'SECTOR 01 // QUANTUM & ASTROPHYSICS',
      subtitle: 'Mapeo del código como campo termodinámico, singularidades gravitacionales y plegamiento molecular.',
      color: '#00f0ff',
      metrics: [
        { lbl: 'Teorema AdS/CFT', val: 'Maldacena S_bulk' },
        { lbl: 'Recocido Cuántico', val: 'SQA P=8 Trotter' },
        { lbl: 'Plegamiento Proteico', val: 'GroEL/GroES 14 ATP' },
        { lbl: 'Filtro Maxwell', val: '8 Leyes Físicas' }
      ],
      subsystems: [
        {
          name: 'Holographic Black Hole Engine',
          meta: 'core/actions/holographic_black_hole.py',
          desc: 'Modela módulos hipertróficos como singularidades de Schwarzschild aplicando la dualidad holográfica AdS/CFT y el límite de Bekenstein-Hawking. Predice la fuga de bugs ocultos a través de radiación de Hawking.',
          formula: 'S_{\\text{bulk}} \\le \\eta \\cdot \\text{Area}_{\\partial} = \\frac{c^3 k}{4 G \\hbar} A',
          analogy: 'Un archivo gigantesco concentra tanta masa que su horizonte de sucesos atrapa defectos. La radiación de Hawking cuantifica la velocidad a la que estos defectos escapan e infectan los archivos dependientes.'
        },
        {
          name: 'Quantum Simulated Annealer (SQA)',
          meta: 'core/actions/quantum_annealer.py',
          desc: 'Resuelve la selección combinatoria de refactorizaciones mediante un Hamiltoniano de Ising QUBO discretizado en P=8 láminas de Trotter-Suzuki con efecto túnel cuántico.',
          formula: '\\mathcal{H}_{SQA} = \\sum_{p=1}^P \\left[ \\mathcal{H}_{QUBO}(s^{(p)}) - J_\\perp \\sum_i s_i^{(p)} s_i^{(p+1)} \\right]',
          analogy: 'Permite transiciones de refactorización donde la energía clásica subiría transitoriamente (rompiendo temporalmente tests), atravesando barreras energéticas para alcanzar el mínimo global.'
        },
        {
          name: 'Chaperón Molecular de Código',
          meta: 'core/actions/code_folding_chaperone.py',
          desc: 'Inspirado en Christian Anfinsen y las chaperoninas biológicas GroEL/GroES. Modela métodos como aminoácidos, detecta placas amiloides (Alzheimer de software) e hidroliza 14 ATP para replegar métodos.',
          formula: '\\Delta G = \\Delta H - T \\Delta S \\quad \\xrightarrow{\\text{GroEL}} \\quad 14 \\times \\text{ATP} \\to \\text{Conformación Nativa}',
          analogy: 'Cuando un módulo está mal plegado, se agregan dependencias insolubles que bloquean la compilación. El chaperón aísla la función en una cavidad protegida y gasta energía para llevarla a su estado nativo.'
        },
        {
          name: 'Filtro de Lorentz & Demonio de Maxwell',
          meta: 'core/actions/synthetic_lorentz_filter.py',
          desc: 'Evalúa el parche frente a 8 leyes físicas (Newton, Lorentz, Little, Hyrum, Postel, Reynolds, Chandrasekhar, Prigogine) calculando la probabilidad de penetración de barrera por efecto túnel.',
          formula: 'P_{\\text{tunnel}} = \\exp\\left(-2 \\int_{x_1}^{x_2} \\sqrt{\\frac{2m}{\\hbar^2}(V(x) - E)} \\, dx\\right) \\quad \\text{con } MS \\ge 0.72',
          analogy: 'Filtra parches de código que intenten violar leyes de conservación de flujo o que pretendan introducir saltos cuánticos de complejidad no justificada.'
        }
      ]
    },

    cybernetics: {
      id: 'cybernetics',
      name: 'Reglas Sistémicas & Cibernética',
      badge: 'SECTOR 02 // PANARCHY & SYSTEMS LAWS',
      subtitle: 'Formalización de la resiliencia ecosistémica, variedad cibernética y estructuras disipativas.',
      color: '#00ff88',
      metrics: [
        { lbl: 'Panaquía Ecológica', val: 'Holling r-K-Ω-α' },
        { lbl: 'Variedad Requerida', val: 'Ashby V = log₂(N)' },
        { lbl: 'Capacidad Canal', val: 'Shannon C = B·log₂(1+S/N)' },
        { lbl: 'Termodinámica', val: 'Prigogine dS = diS + deS' }
      ],
      subsystems: [
        {
          name: 'Ciclo Adaptativo de Panaquía',
          meta: 'core/analyzers/rules/rule_panarchy_adaptive_cycle.py',
          desc: 'Modela la resiliencia en 4 fases: Crecimiento (r), Esclerosis/Conservación (K), Colapso Caótico (Ω) y Renovación Plástica (α). Simula contagio epidemiológico SIR amortiguado por cobertura de tests.',
          formula: 'K_{\\text{score}} = 0.40 \\cdot \\widehat{fan\\_in} + 0.30 \\cdot \\widehat{LOC} + 0.30 \\cdot \\widehat{days} \\quad \\left(p_{95}\\right)',
          analogy: 'El software petrificado (God Objects) acumula tanta rigidez que no puede absorber innovaciones sin fracturarse. Panaquía predice cuándo un módulo colapsará hacia una fase de reescritura caótica.'
        },
        {
          name: 'Ley de Variedad Requerida de Ashby',
          meta: 'core/analyzers/rules/rule_ashby_requisite_variety.py',
          desc: 'Mide el vector de variedad tetradimensional V=(S, B, T, Sem) y penaliza la pérdida informacional en fronteras cuando un subsistema comprime estados de error en firmas simplistas.',
          formula: '\\text{Loss} = \\max\\left(0, \\; \\log_2(\\text{rutas\\_internas}) - V_{\\text{retorno}}\\right) \\quad \\text{con } R = \\frac{V_{\\text{ctrl}}}{V_{\\text{sys}}} \\ge 1.0',
          analogy: 'Un controlador con solo 2 respuestas (ej. true/false) jamás podrá regular un subsistema que posee 50 estados de fallo posibles. Se pierde variedad y se induce ceguera cibernética.'
        },
        {
          name: 'Estructuras Disipativas de Prigogine',
          meta: 'core/analyzers/rules/rule_prigogine_dissipative_structures.py',
          desc: 'Evalúa si el sistema expulsa entropía mediante Dead Letter Queues (DLQ), desprendimiento de carga (load shedding) y buffers finitos, clasificando en regímenes Cristalino, Geomagnético y Tormenta.',
          formula: 'S_{\\text{norm}} = 1.0 - \\frac{1.0}{1.0 + \\frac{S_{\\text{total}}}{2.0}} \\in [0.0, 1.0]',
          analogy: 'Los sistemas abiertos sobreviven expulsando entropía al entorno. Si un proceso acumula eventos erróneos sin sumidero DLQ, sufre de asfixia entrópica y colapso térmico.'
        },
        {
          name: 'Teorema CAP & Aislamiento por Mamparos',
          meta: 'core/analyzers/rules/rule_cap_theorem.py & bulkhead.py',
          desc: 'Clasificador AST de consistencia vs disponibilidad (CP vs AP) y cálculo del umbral crítico de percolación de Molloy-Reed para contención de fallos en cascada.',
          formula: 'p_c = \\frac{\\langle k \\rangle}{\\langle k^2 \\rangle - \\langle k \\rangle} \\quad \\text{y} \\quad Q = \\frac{\\Delta P}{R_{\\text{mamparo}}}',
          analogy: 'Evita que el fallo de un microservicio inunde la red completa al verificar que existan mamparos de contención que detengan la percolación del componente gigante.'
        }
      ]
    },

    semantics: {
      id: 'semantics',
      name: 'Semántica, Costuras & Refactorización',
      badge: 'SECTOR 03 // SEAMS & CRYOGENIC PURITY',
      subtitle: 'Detección de costuras de modificación, optimización submodular y pureza al Cero Absoluto.',
      color: '#ffaa00',
      metrics: [
        { lbl: 'Costuras Feathers', val: '6 Tipos de Seams' },
        { lbl: 'Suite Refactoring', val: '8 Módulos Especializados' },
        { lbl: 'Pureza Criogénica', val: '0 Kelvin (ΔS = 0)' },
        { lbl: 'Decaimiento Rutherford', val: 'N(t) = N₀·e^(-λt)' }
      ],
      subsystems: [
        {
          name: 'Descubridor de Costuras (Seam Discovery)',
          meta: 'core/analyzers/semantics/seam_discovery.py',
          desc: 'Identifica 6 clases de costuras de Michael Feathers (Abstract Boundary, Constructor Injection, Decorator Hook, etc.) para aislar y desacoplar componentes sin alterar a sus llamadores.',
          formula: '\\text{Fuerza}_{\\text{Boundary}} = 0.90 \\implies \\text{Candidato a Microservicio: } \\text{True}',
          analogy: 'Encuentra las líneas de fractura naturales donde se puede insertar una sonda de prueba o extraer una clase a un servicio independiente sin tocar el código existente.'
        },
        {
          name: 'Suite de Refactorización en 8 Módulos',
          meta: 'core/analyzers/semantics/refactoring_*.py',
          desc: 'Pipeline distribuido: LCOM4 sobre grafo bipartito de métodos para Extract Class, análisis Live-In/Live-Out para Extract Method y optimización submodular de Nemhauser.',
          formula: '\\tau(f) = 1.0 - \\exp\\left(-1.25 \\cdot E(f)\\right) \\quad \\text{con techo suave } C^1 \\text{ en } \\kappa = 0.85',
          analogy: 'Prioriza matemáticamente los focos de deuda técnica garantizando que la extracción de un método no diluya ni duplique erróneamente los créditos de refactorización.'
        },
        {
          name: 'Validador Criogénico Cero Absoluto',
          meta: 'core/analyzers/semantics/purity.py',
          desc: 'Comprueba transparencia referencial estricta. Si un archivo es 100% puro y su hash Merkle no cambia, el daemon congela su estado con TTL=∞, gastando cero ciclos de CPU.',
          formula: 'f \\text{ es PURA} \\iff \\forall x: f(x) = f(x) \\;\\land\\; \\Delta S_{\\text{externo}} = 0 \\implies T = 0\\text{ K}',
          analogy: 'Una función pura es una ecuación algebraica cristalina que no emite calor en el sistema; puede ser memoizada perpetuamente sin riesgo de efectos colaterales.'
        },
        {
          name: 'Desintegración Radiactiva en Código Muerto',
          meta: 'core/analyzers/semantics/dead_stores.py',
          desc: 'Aplica la ecuación de Ernest Rutherford cruzando referencias cruzadas con la antigüedad en Git, clasificando los desechos en Núcleo Estable, Isótopo Volátil y Escoria Radiactiva.',
          formula: 'N(t) = N_0 \\cdot e^{-\\lambda t} \\quad \\text{con } \\lambda = \\frac{\\ln(2)}{T_{1/2}}',
          analogy: 'Distingue entre código que acaba de nacer como puente temporal vs código zombi que lleva 2 años en estado de putrefacción radiactiva sin ser llamado.'
        }
      ]
    },

    rust: {
      id: 'rust',
      name: 'Motor Nativo Rust Zero-GIL',
      badge: 'SECTOR 04 // archangel_rs & MULTI-VM',
      subtitle: 'Análisis de bytecode EVM/WASM sin ejecución simbólica pesada y resolución de punteros Andersen.',
      color: '#ff3366',
      metrics: [
        { lbl: 'Código Rust', val: '31,666 LOC Zero-GIL' },
        { lbl: 'EVM Bytecode', val: 'SWC-107, 115, 104' },
        { lbl: 'CosmWasm WASM', val: 'Decodificador Secciones' },
        { lbl: 'Points-To Pts', val: 'Andersen 1-Obj Context' }
      ],
      subsystems: [
        {
          name: 'Deconstructor EVM Nativo (evm.rs)',
          meta: 'archangel_rs/src/evm.rs',
          desc: 'Decodifica bytecode EVM en crudo, pela metadatos CBOR y detecta reentrancia (SWC-107) y bypass de tx.origin (SWC-115) simulando pilas de llamadas sin overhead de ejecución simbólica.',
          formula: '\\text{PC} \\to \\text{Opcode} \\implies \\text{SimulatedCallStack}(gas, storage\\_slots) \\quad [O(N)]',
          analogy: 'Audita contratos inteligentes a nivel de bytecode binario de forma instantánea, identificando transferencias de control externas no protegidas antes de la actualización de estado.'
        },
        {
          name: 'Inspector CosmWasm WASM (wasm.rs)',
          meta: 'archangel_rs/src/wasm.rs',
          desc: 'Parsea secciones binarias de WebAssembly, resuelve llamadas dinámicas indirectas a través de la tabla de elementos y verifica que las escrituras a almacenamiento tengan guardas de identidad.',
          formula: '\\text{WASM\\_SECTION\\_ELEMENT} \\xrightarrow{\\text{table\\_match}} \\text{Callee} \\vdash env.db\\_write \\cap \\text{Guard}(memcmp)',
          analogy: 'Garantiza que contratos inteligentes en Rust/WASM no contengan escrituras a storage no autorizadas por desvíos en el despacho indirecto de traits.'
        },
        {
          name: 'Resolutor de Puntos Andersen (race_pts.rs)',
          meta: 'archangel_rs/src/race_pts.rs',
          desc: 'Análisis interprocedural de puntos-a con sensibilidad de contexto de 1 objeto/argumento y uniones de bitsets ultrarrápidas con FxHash.',
          formula: 'pts(p) \\supseteq pts(q) \\quad \\text{si } p = q; \\quad pts(p) \\supseteq \\{o\\} \\quad \\text{si } p = \\&o',
          analogy: 'Resuelve si dos hilos concurrentes están apuntando a la misma posición física de memoria compartida, prediciendo condiciones de carrera sin falsos positivos.'
        },
        {
          name: 'Arnés de Mutación Ground Truth',
          meta: 'calibration/mutation/templates.py',
          desc: 'Genera pares controlados de plantillas vulnerables emparejadas con sus gemelos seguros (safe twins) en 4 contextos sintácticos para validar la precisión del motor.',
          formula: '\\text{Precision} = \\frac{TP}{TP + FP}, \\quad \\text{Recall} = \\frac{TP}{TP + FN} \\quad \\text{sobre } 31 \\text{ Laboratorios}',
          analogy: 'Demuestra matemáticamente que el motor de análisis no alucina ni sufre de sesgos subjetivos de calibración.'
        }
      ]
    },

    memory: {
      id: 'memory',
      name: 'GraphRAG & Memoria Semántica Merkle',
      badge: 'SECTOR 05 // HYBRID RETRIEVAL & HASHING',
      subtitle: 'Base SQLite WAL de 2 capas, embeddings topológicos Node2Vec y rutas narrativas de Steiner.',
      color: '#b845ff',
      metrics: [
        { lbl: 'Knowledge Graph', val: '3,404 LOC SQLite WAL' },
        { lbl: 'Topología Node2Vec', val: 'NumPy SGNS (Sin PyTorch)' },
        { lbl: 'Merkle α-Equivalente', val: 'Hashing Scope-Relative' },
        { lbl: 'Rutas Narrativas', val: 'Steiner Tree MST' }
      ],
      subsystems: [
        {
          name: 'KnowledgeGraph SQLite WAL (3,404 líneas)',
          meta: 'core/memory/knowledge_graph.py',
          desc: 'Arquitectura concurrente: escritor único RLock con lectores ilimitados por hilo en SQLite WAL. Checkpointer de fondo, traversal fluido Gremlin V() y corte mínimo de cuellos de botella con Edmonds-Karp.',
          formula: '\\text{Noisy-OR: } P(\\text{riesgo}) = 1.0 - \\prod_{e \\in \\text{in}} \\left(1.0 - P_e \\cdot w_e\\right) \\quad [\\text{Damping } 0.85]',
          analogy: 'Permite que múltiples hilos consulten el grafo de dependencias en tiempo real sin bloquearse, propagando la probabilidad de vulnerabilidad como una red bayesiana de Markov.'
        },
        {
          name: 'Node2Vec SGNS desde cero en NumPy',
          meta: 'core/memory/graph_rag/topology.py',
          desc: 'Caminatas aleatorias sesgadas de 2º orden (p, q) con Skip-Gram Negative Sampling implementado exclusivamente en NumPy, fusionando 24 dimensiones topológicas con 768 densas.',
          formula: '\\pi_{vx} = \\alpha_{pq}(t, x) \\cdot w_{vx}, \\quad \\nabla \\mathcal{L} = \\left(\\sigma(z) - y\\right) \\cdot \\mathbf{v}_{in}',
          analogy: 'Le enseña a los modelos vectoriales dónde vive un archivo en la arquitectura general, sin depender de librerías pesadas como PyTorch o DGL.'
        },
        {
          name: 'Árboles Merkle Semánticos α-Equivalentes',
          meta: 'core/memory/hashing.py (1,496 líneas)',
          desc: 'Identificadores de variables canónicos (v0, v1) insensibles a renombrado y mini-PDG que reordena asignaciones puras independientes. Si cambias 1 función, solo se invalida ese símbolo.',
          formula: '\\text{Hash}(a=1; b=2) \\equiv \\text{Hash}(b=2; a=1) \\quad [\\text{Mini-PDG IndBlock}]',
          analogy: 'Garantiza que una simple limpieza cosmética o renombrado de variable local no obligue a reindexar miles de archivos del proyecto.'
        },
        {
          name: 'Explicabilidad Contrafáctica (MMR & Steiner)',
          meta: 'core/memory/explainability.py',
          desc: 'Responde "¿Por qué X y no Y?" (Miller 2019) y enlaza los nodos recuperados construyendo la espina dorsal narrativa mediante un árbol de expansión mínima MST.',
          formula: '\\text{MMR} = \\operatorname*{argmax}_{D_i} \\left[ \\lambda \\cdot \\text{Sim}(D_i, Q) - (1 - \\lambda) \\cdot \\max_{D_j} \\text{Sim}(D_i, D_j) \\right]',
          analogy: 'Evita devolver 5 funciones redundantes del mismo archivo y explica de forma transparente por qué un candidato fue descartado por diversidad.'
        }
      ]
    },

    cognitive: {
      id: 'cognitive',
      name: 'Coliseo Cognitivo, Debate & Autopsia',
      badge: 'SECTOR 06 // MULTI-AGENT DIALECTICS',
      subtitle: 'Dialéctica bipolar, orbe ambiental, shadow replay escéptico y memoria genética profiláctica.',
      color: '#ffdf78',
      metrics: [
        { lbl: 'El Coliseo', val: 'Purista vs Hacker vs Sintetizador' },
        { lbl: 'El Orbe Fantasma', val: 'SSE Threadsafe Bridge' },
        { lbl: 'El Escéptico', val: 'Shadow Replay Audit' },
        { lbl: 'Memoria Genética', val: 'PromptDNA & Profilaxis' }
      ],
      subsystems: [
        {
          name: 'El Coliseo: Debate Multi-Agente',
          meta: 'core/engine/chat_debate.py',
          desc: 'Combate dialéctico ejecutado en paralelo con asyncio.gather: Purista (corrección formal) vs Hacker (pragmatismo de entrega), arbitrados por un Sintetizador que emite el veredicto en dorado.',
          formula: '\\text{Modo Enjambre (\\ge 120 LOC): } \\operatorname{Consensus}(\\text{Ashby}, \\text{Chandrasekhar}, \\text{Lorentz}, \\text{Seguridad})',
          analogy: 'En lugar de confiar en una sola respuesta apresurada de un LLM, dos agentes con sesgos contrarios debaten el diseño y un director extrae la solución superior.'
        },
        {
          name: 'El Escéptico (Shadow Replay)',
          meta: 'core/engine/chat_shadow_replay.py',
          desc: 'Destruye el sesgo de supervivencia: un auditor independiente sin memoria de prompts previos revisa el código "exitoso" para cazar puntos ciegos, degradando el veredicto si hay dudas.',
          formula: '\\text{Veredicto} = \\text{CLEAN} \\quad \\xrightarrow{\\text{Objeción}} \\quad \\text{SUCCESS\\_WITH\\_CAVEATS}',
          analogy: 'Evita que el sistema cante victoria falsamente si el optimizador engañó a su propio detector interno.'
        },
        {
          name: 'El Forense & Autopsia Causal',
          meta: 'core/engine/chat_autopsy.py',
          desc: 'Reconstruye el grafo causal de fallos y trayectorias PID (P, I, D, T) cuando un ciclo termodinámico no converge, aislando antipatrones tercos y entregando los controles al humano.',
          formula: '\\text{CausalChain}: \\text{Iteración}_k \\xrightarrow{\\Delta PID} \\text{Antipatrón}_j \\to \\text{Persistencia}(\\ge 2)',
          analogy: 'Explica con precisión científica por qué falló un intento de refactorización automática y qué ganancia debe ajustarse.'
        },
        {
          name: 'Memoria Genética e Inmunológica',
          meta: 'core/engine/chat_genetic_memory.py',
          desc: 'Inyecta anticuerpos técnicos directamente en el PromptDNA del archivo, precarga ganancias de partida basadas en archivos similares y consolida vacunas en frío durante el sueño.',
          formula: '\\text{PromptDNA} \\leftarrow \\text{DNA}_0 + \\sum \\text{Antibodies}(\\text{lexical\\_signature})',
          analogy: 'El sistema recuerda los traumas pasados de cada archivo: si database.py ya sufrió de condiciones de carrera antes, precarga los anticuerpos para no repetir el error.'
        }
      ]
    },

    sociotechnical: {
      id: 'sociotechnical',
      name: 'Sensor Sociotécnico, Conway & Git',
      badge: 'SECTOR 07 // SENSING & CONWAY LAWS',
      subtitle: 'Decaimiento de memoria de Ebbinghaus, brecha de Conway y fatiga física de materiales de software.',
      color: '#00c3ff',
      metrics: [
        { lbl: 'Curva Ebbinghaus', val: 'K(t) = e^(-λt) (12m Half-Life)' },
        { lbl: 'Brecha de Conway', val: 'Distancia Sociotécnica' },
        { lbl: 'Fatiga Material', val: 'CWE-710 (>15 commits/sprint)' },
        { lbl: 'Reloj Lamport', val: 'Trazabilidad Causal Happens-Before' }
      ],
      subsystems: [
        {
          name: 'Decaimiento de Conocimiento de Ebbinghaus',
          meta: 'core/utils/git_utils.py (1,938 líneas)',
          desc: 'Pondera las líneas de código por una función de decaimiento radiactivo con vida media de 12 meses. Detecta el relevo cognitivo cuando el autor histórico ya no mantiene el archivo.',
          formula: 'K(t) = e^{-\\lambda t}, \\quad \\lambda = \\frac{\\ln(2)}{\\text{half\\_life\\_months}} \\quad \\left[W(a) = \\sum_{l} K(t_l)\\right]',
          analogy: 'Quien escribió el 90% de un archivo hace 3 años ya no lo entiende. El sensor sociotécnico identifica al verdadero dueño operativo en el presente.'
        },
        {
          name: 'Isomorfismo y Brecha de Conway',
          meta: 'core/analyzers/metrics/conway_analyzer.py',
          desc: 'Cruza el grafo técnico de dependencias contra el grafo social de colaboración en Git. Si dos módulos están fuertemente acoplados pero sus desarrolladores no se comunican, alerta de Silo.',
          formula: '\\text{ConwayGap} = \\frac{1.0}{1.0 + \\text{social\\_weight}} \\quad \\left[\\text{Gap} > 0.66 \\implies \\text{Riesgo HIGH}\\right]',
          analogy: 'Predice con rigor sociológico qué contratos de software se romperán en producción debido a barreras organizacionales entre equipos.'
        },
        {
          name: 'Medidor de Fatiga de Material (CWE-710)',
          meta: 'core/analyzers/metrics/fatigue_detector.py',
          desc: 'Analogía de fatiga elástica en metales: funciones modificadas >15 veces por sprint sufren microfisuras y pánico de código con alta tasa de parches reactivos.',
          formula: '\\text{Hotspot} = 0.50 F_{\\text{fatiga}} + 0.25 \\min\\left(\\frac{CC}{30}, 1\\right) + 0.15 \\min\\left(\\frac{H}{7}, 1\\right) + 0.10 R_{\\text{parches}}',
          analogy: 'Un componente al que se le inyectan 20 parches en 2 semanas es un material fatigado que colapsará estructuralmente ante cualquier incremento de carga.'
        },
        {
          name: 'Grafo Causal con Relojes de Lamport',
          meta: 'core/engine/bus_trace.py',
          desc: 'Trazabilidad causal con enteros atómicos incrementales y tuplas causal_of propagadas automáticamente en el EventBus para reconstrucción forense time-travel.',
          formula: 'e_a \\to e_b \\iff L(e_a) < L(e_b) \\;\\land\\; e_a \\in \\text{causal\\_of}(e_b)',
          analogy: 'Permite rebobinar el tiempo y reconstruir exactamente qué evento asíncrono causó una condición de carrera sin depender de relojes de pared.'
        }
      ]
    },

    correlator: {
      id: 'correlator',
      name: 'Correlador Bayesiano V3 & Retículo',
      badge: 'SECTOR 08 // BELLMAN LATTICE & SHAPLEY',
      subtitle: 'Programación dinámica sobre retículo booleano {0,1}ᵏ, valores de Shapley y escalera concurrente.',
      color: '#ff5500',
      metrics: [
        { lbl: 'Programación Dinámica', val: 'Retículo Booleano {0,1}ᵏ' },
        { lbl: 'Teoría de Juegos', val: 'Valores de Shapley (1953)' },
        { lbl: 'Matriz Adaptativa', val: 'Pearson Φ + NPMI Bouma' },
        { lbl: 'Gating de Activo', val: 'Techo REFACTOR en Tests' }
      ],
      subsystems: [
        {
          name: 'Programación Dinámica sobre Retículo {0,1}ᵏ',
          meta: 'core/analyzers/correlator/confidence.py',
          desc: 'Resuelve la convergencia de confianza de múltiples analizadores de forma exacta sobre el retículo de subconjuntos, eliminando la anomalía donde añadir evidencia reducía la confianza.',
          formula: '\\text{FP}^*(U) = \\min_{x \\in U} \\left[ \\text{FP}^*(U \\setminus \\{x\\}) \\cdot \\left(1 - P_{\\text{eff}}(x \\mid U \\setminus \\{x\\})\\right) \\right]',
          analogy: 'Garantiza monotonía matemática estricta: añadir un analizador que corrobora un hallazgo siempre incrementa la certeza final.'
        },
        {
          name: 'Atribución Cooperativa de Shapley (1953)',
          meta: 'core/analyzers/correlator/confidence.py',
          desc: 'Modela la corroboración como un juego cooperativo donde la ganancia es 1 - FP*, descomponiendo el mérito porcentual exacto de cada analizador según los 4 axiomas de Lloyd Shapley.',
          formula: '\\phi_i(v) = \\sum_{T \\subseteq S \\setminus \\{i\\}} \\frac{|T|!(|S| - |T| - 1)!}{|S|!} \\left[ v(T \\cup \\{i\\}) - v(T) \\right]',
          analogy: 'Demuestra con exactitud qué porcentaje de una alerta se debe a Taint Analysis, a Concurrencia o a la Regla de Ashby, sin arbitrariedades.'
        },
        {
          name: 'Escalera Concurrente de 3 Escalones',
          meta: 'core/analyzers/correlator/concurrency_evidence.py',
          desc: 'Elimina falsos positivos en código asíncrono. Solo asciende una carrera a CRITICAL si verifica: (1) ventana de entrelazado, (2) dos actores concurrentes reales, y (3) violación de invariante.',
          formula: '\\text{Ventana} \\xrightarrow{\\text{2 Actores AST}} \\text{Concurrencia} \\xrightarrow{\\text{LostUpdate / CheckThenAct}} \\text{CRITICAL}',
          analogy: 'Distingue una corrutina async normal de un bug de concurrencia mortal donde una actualización de estado se pierde en producción.'
        },
        {
          name: 'Gating por Rol de Activo y Síntesis de Fix',
          meta: 'core/analyzers/correlator/asset_role.py & fix_synthesis.py',
          desc: 'Clasifica archivos por jerarquía de directorios. Los tests y mocks nunca reciben veredictos CRITICAL ni bloquean el CI/CD; y sintetiza parches arquitectónicos cuando convergen ≥4 categorías.',
          formula: '\\text{Si } \\text{AssetRole} \\neq \\text{PRODUCTION} \\implies \\text{Verdict} \\le \\text{REFACTOR}',
          analogy: 'Impide que credenciales falsas o código experimental en tests unitarios detengan el despliegue a producción con falsas alarmas.'
        }
      ]
    }
  };

  // Aliases canónicos para unificar los IDs de tabs (05, 06, 08) con el Radar 3D y el Inspector
  SECTORS_DATA.graphrag = SECTORS_DATA.memory;
  SECTORS_DATA.colosseum = SECTORS_DATA.cognitive;
  SECTORS_DATA.bayesian = SECTORS_DATA.correlator;

  // ══════════════════════════════════════════════════════════════════════════
  // 2. HUD SUPERIOR: TELEMETRÍA EN VIVO Y OSCILOSCOPIO QUANTUM
  // ══════════════════════════════════════════════════════════════════════════

  let lamportClock = 42890;
  let baseEntropy = 3.442;
  let currentSectorKey = 'physics';

  function initTelemetry() {
    const elClock = document.getElementById('telemLamport');
    const elEntropy = document.getElementById('telemEntropy');
    const elSSI = document.getElementById('telemSSI');
    const elFreq = document.getElementById('telemFreq');

    setInterval(() => {
      // Reloj Lamport atómico
      lamportClock += Math.floor(Math.random() * 3) + 1;
      if (elClock) elClock.textContent = `L-${lamportClock}`;

      // Flujo de Entropía de Shannon con micro-fluctuación
      const entropyDelta = (Math.sin(Date.now() / 2500) * 0.04) + ((Math.random() - 0.5) * 0.01);
      const currentEntropy = (baseEntropy + entropyDelta).toFixed(3);
      if (elEntropy) elEntropy.textContent = `${currentEntropy} bit/s`;

      // Software Stability Index
      const ssiFluct = (94.85 + Math.sin(Date.now() / 4000) * 0.35).toFixed(1);
      if (elSSI) elSSI.textContent = `${ssiFluct}%`;

      // Frecuencia homeostática del reactor
      const freqDrift = (55.0 + Math.sin(Date.now() / 1500) * 0.15).toFixed(1);
      if (elFreq) elFreq.textContent = `${freqDrift} Hz`;
    }, 400);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 3. EL REACTOR CENTRAL INTERACTIVO (CANVAS 2.5D CON ANILLOS TENSORIALES)
  // ══════════════════════════════════════════════════════════════════════════

  let canvas, ctx;
  let width = 800, height = 600;
  let isPaused = false;
  let showTrails = true;
  let simSpeed = 1.0;

  // Parámetros de interacción con el ratón
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isDown: false, lastX: 0, lastY: 0 };
  let cameraRot = { x: 0.45, y: -0.2 };
  let cameraTargetRot = { x: 0.45, y: -0.2 };

  // Los 5 Anillos Tensoriales Orbitales D1 - D5
  const TENSOR_RINGS = [
    { name: 'D1: Tensor Feedback Coupling', radius: 110, speed: 0.012, tiltX: 0.35, tiltZ: 0.2, color: '#00f0ff', width: 2.5 },
    { name: 'D2: Jacobian Gradient ||∇R||', radius: 155, speed: -0.009, tiltX: -0.4, tiltZ: -0.3, color: '#ffaa00', width: 2.0 },
    { name: 'D3: Chaotic Debt Attractor', radius: 205, speed: 0.007, tiltX: 0.5, tiltZ: -0.15, color: '#b845ff', width: 2.2 },
    { name: 'D4: Lyapunov Exponent λmax', radius: 260, speed: -0.005, tiltX: -0.3, tiltZ: 0.4, color: '#00ff88', width: 2.0 },
    { name: 'D5: Percolation Critical pc', radius: 315, speed: 0.004, tiltX: 0.25, tiltZ: -0.35, color: '#ff3366', width: 2.4 }
  ];

  // Partículas cuánticas en tránsito
  const PARTICLES = [];
  const NUM_PARTICLES = 140;

  for (let i = 0; i < NUM_PARTICLES; i++) {
    const ringIdx = i % TENSOR_RINGS.length;
    PARTICLES.push({
      ringIndex: ringIdx,
      angle: Math.random() * Math.PI * 2,
      speed: (0.01 + Math.random() * 0.015) * (ringIdx % 2 === 0 ? 1 : -1),
      radialOffset: (Math.random() - 0.5) * 14,
      size: Math.random() * 2.2 + 1.2,
      opacity: Math.random() * 0.7 + 0.3
    });
  }

  // Rayos de pulsos radiales desde el núcleo
  const PULSES = [];

  function emitPulse() {
    if (PULSES.length < 5) {
      PULSES.push({ radius: 10, maxRadius: 360, opacity: 0.8, color: '#00f0ff' });
    }
  }
  setInterval(emitPulse, 1600);

  function initCanvas() {
    const viewport = document.getElementById('canvasViewport');
    canvas = document.getElementById('reactorCanvas');
    if (!canvas || !viewport) return;

    // Si el motor de radar 3D mejorado está cargado, inicializarlo
    if (window.ArchangelRadar) {
      window.radarInstance = new window.ArchangelRadar(canvas, {
        initialSector: currentSectorKey,
        onSelect: (sector) => {
          selectSector(sector.id, false);
        }
      });
      return;
    }

    ctx = canvas.getContext('2d');

    function resize() {
      const rect = viewport.getBoundingClientRect();
      width = canvas.width = rect.width * (window.devicePixelRatio || 1);
      height = canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }

    window.addEventListener('resize', resize);
    resize();

    // Eventos de interacción con el ratón
    viewport.addEventListener('mousedown', (e) => {
      mouse.isDown = true;
      mouse.lastX = e.clientX;
      mouse.lastY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      mouse.isDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (mouse.isDown) {
        const dx = e.clientX - mouse.lastX;
        const dy = e.clientY - mouse.lastY;
        cameraTargetRot.y += dx * 0.005;
        cameraTargetRot.x += dy * 0.005;
        cameraTargetRot.x = Math.max(-0.9, Math.min(0.9, cameraTargetRot.x));
        mouse.lastX = e.clientX;
        mouse.lastY = e.clientY;
      }
    });

    // Touch support para móviles
    viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        mouse.isDown = true;
        mouse.lastX = e.touches[0].clientX;
        mouse.lastY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      mouse.isDown = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (mouse.isDown && e.touches.length === 1) {
        const dx = e.touches[0].clientX - mouse.lastX;
        const dy = e.touches[0].clientY - mouse.lastY;
        cameraTargetRot.y += dx * 0.006;
        cameraTargetRot.x += dy * 0.006;
        cameraTargetRot.x = Math.max(-0.9, Math.min(0.9, cameraTargetRot.x));
        mouse.lastX = e.touches[0].clientX;
        mouse.lastY = e.touches[0].clientY;
      }
    }, { passive: true });

    requestAnimationFrame(renderLoop);
  }

  // Proyección 3D a 2D isométrica/perspectiva ligera
  function project3D(x, y, z, cx, cy) {
    // Rotación en Y
    const cosY = Math.cos(cameraRot.y);
    const sinY = Math.sin(cameraRot.y);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    // Rotación en X
    const cosX = Math.cos(cameraRot.x);
    const sinX = Math.sin(cameraRot.x);
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    // Perspectiva leve
    const fov = 700;
    const scale = fov / (fov + z2);

    return {
      x: cx + x1 * scale,
      y: cy + y2 * scale,
      scale: scale,
      depth: z2
    };
  }

  function renderLoop() {
    if (!ctx) return;

    // Suavizado de cámara
    cameraRot.x += (cameraTargetRot.x - cameraRot.x) * 0.08;
    cameraRot.y += (cameraTargetRot.y - cameraRot.y) * 0.08;

    const displayW = canvas.width / (window.devicePixelRatio || 1);
    const displayH = canvas.height / (window.devicePixelRatio || 1);
    const cx = displayW / 2;
    const cy = displayH / 2;

    // Limpieza con rastro si los trails están activos
    if (showTrails) {
      ctx.fillStyle = 'rgba(5, 7, 12, 0.22)';
      ctx.fillRect(0, 0, displayW, displayH);
    } else {
      ctx.clearRect(0, 0, displayW, displayH);
    }

    // Dibujo de retícula técnica de fondo
    drawGrid(cx, cy);

    // Ondas de choque de pulsos
    renderPulses(cx, cy);

    // Dibujo de los 5 Anillos Tensoriales
    renderTensorRings(cx, cy);

    // Dibujo del Núcleo Central: Tokamak DAG & Correlador de Bellman
    renderTokamakCore(cx, cy);

    // Dibujo de los Satélites de los 8 Sectores en órbita
    renderSectorSatellites(cx, cy);

    // Partículas cuánticas viajando por los anillos
    renderParticles(cx, cy);

    if (!isPaused) {
      // Actualizar ángulos
      TENSOR_RINGS.forEach(ring => {
        ring.currentAngle = (ring.currentAngle || 0) + ring.speed * simSpeed;
      });

      PARTICLES.forEach(p => {
        p.angle += p.speed * simSpeed;
      });

      for (let i = PULSES.length - 1; i >= 0; i--) {
        PULSES[i].radius += 2.5 * simSpeed;
        PULSES[i].opacity -= 0.007 * simSpeed;
        if (PULSES[i].opacity <= 0 || PULSES[i].radius >= PULSES[i].maxRadius) {
          PULSES.splice(i, 1);
        }
      }
    }

    requestAnimationFrame(renderLoop);
  }

  function drawGrid(cx, cy) {
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
    ctx.lineWidth = 1;

    // Círculos concéntricos de referencia estática
    for (let r = 80; r <= 360; r += 70) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Ejes radiales cruzados
    ctx.beginPath();
    ctx.moveTo(cx - 380, cy);
    ctx.lineTo(cx + 380, cy);
    ctx.moveTo(cx, cy - 380);
    ctx.lineTo(cx, cy + 380);
    ctx.stroke();
  }

  function renderPulses(cx, cy) {
    PULSES.forEach(pulse => {
      ctx.save();
      ctx.strokeStyle = `rgba(0, 240, 255, ${pulse.opacity * 0.5})`;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, pulse.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
  }

  function renderTokamakCore(cx, cy) {
    const pulseFactor = Math.sin(Date.now() / 350) * 4;
    const baseR = 36 + pulseFactor;

    // Resplandor exterior de confinamiento de plasma
    const gradOuter = ctx.createRadialGradient(cx, cy, baseR * 0.3, cx, cy, baseR * 2.2);
    gradOuter.addColorStop(0, 'rgba(255, 170, 0, 0.9)');
    gradOuter.addColorStop(0.35, 'rgba(255, 85, 0, 0.45)');
    gradOuter.addColorStop(0.7, 'rgba(184, 69, 255, 0.2)');
    gradOuter.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradOuter;
    ctx.beginPath();
    ctx.arc(cx, cy, baseR * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Núcleo denso toroidal
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
    ctx.fill();

    // Ojo de la singularidad interior
    ctx.fillStyle = '#05070c';
    ctx.beginPath();
    ctx.arc(cx, cy, baseR * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Corona láser
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, baseR * 0.75, 0, Math.PI * 2);
    ctx.stroke();

    // Etiqueta HUD central
    ctx.fillStyle = '#fff';
    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DAG CORE', cx, cy - 3);
    ctx.fillStyle = '#00f0ff';
    ctx.font = '600 7px "JetBrains Mono", monospace';
    ctx.fillText('BELLMAN', cx, cy + 6);
  }

  function renderTensorRings(cx, cy) {
    const segments = 64;

    TENSOR_RINGS.forEach((ring, idx) => {
      ctx.save();
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = ring.width;
      ctx.shadowColor = ring.color;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        // Posición en el plano del anillo
        let rx = Math.cos(theta) * ring.radius;
        let rz = Math.sin(theta) * ring.radius;
        let ry = 0;

        // Inclinación
        const yRot = ry * Math.cos(ring.tiltX) - rz * Math.sin(ring.tiltX);
        const zRot = ry * Math.sin(ring.tiltX) + rz * Math.cos(ring.tiltX);

        const proj = project3D(rx, yRot, zRot, cx, cy);
        if (i === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      }
      ctx.stroke();

      // Indicador de etiqueta flotante sobre el anillo
      const tagTheta = (Date.now() * 0.0003 * (idx % 2 === 0 ? 1 : -1)) + idx;
      let tagX = Math.cos(tagTheta) * ring.radius;
      let tagZ = Math.sin(tagTheta) * ring.radius;
      const tagYRot = -tagZ * Math.sin(ring.tiltX);
      const tagZRot = tagZ * Math.cos(ring.tiltX);
      const tagProj = project3D(tagX, tagYRot, tagZRot, cx, cy);

      ctx.fillStyle = ring.color;
      ctx.beginPath();
      ctx.arc(tagProj.x, tagProj.y, 3.5 * tagProj.scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '600 8px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillText(ring.name.split(':')[0], tagProj.x + 6, tagProj.y + 2);

      ctx.restore();
    });
  }

  function renderSectorSatellites(cx, cy) {
    const sectorKeys = Object.keys(SECTORS_DATA);
    const orbitRadius = 280;

    sectorKeys.forEach((key, i) => {
      const sector = SECTORS_DATA[key];
      const baseAngle = (i / sectorKeys.length) * Math.PI * 2;
      const currentAngle = baseAngle + (Date.now() * 0.00008);

      const sx = Math.cos(currentAngle) * orbitRadius;
      const sz = Math.sin(currentAngle) * orbitRadius;
      const sy = Math.sin(currentAngle * 2) * 20;

      const proj = project3D(sx, sy, sz, cx, cy);

      const isSelected = key === currentSectorKey;

      ctx.save();

      // Haces de conexión hacia el núcleo central
      ctx.strokeStyle = isSelected ? sector.color : 'rgba(255, 255, 255, 0.07)';
      ctx.lineWidth = isSelected ? 1.6 : 0.8;
      if (isSelected) {
        ctx.setLineDash([4, 4]);
      }
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(proj.x, proj.y);
      ctx.stroke();

      // Pod del satélite
      const podSize = (isSelected ? 9 : 6) * proj.scale;
      ctx.fillStyle = isSelected ? '#fff' : sector.color;
      ctx.shadowColor = sector.color;
      ctx.shadowBlur = isSelected ? 16 : 6;

      ctx.beginPath();
      ctx.arc(proj.x, proj.y, podSize, 0, Math.PI * 2);
      ctx.fill();

      // Halo concéntrico si está seleccionado
      if (isSelected) {
        ctx.strokeStyle = sector.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, podSize + 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Etiqueta flotante del satélite
      ctx.font = isSelected ? '700 10px "JetBrains Mono", monospace' : '500 8.5px "JetBrains Mono", monospace';
      ctx.fillStyle = isSelected ? '#fff' : '#9bb0c4';
      ctx.textAlign = 'center';
      ctx.fillText(sector.name.split(' ')[0], proj.x, proj.y + podSize + 11);

      ctx.restore();
    });
  }

  function renderParticles(cx, cy) {
    PARTICLES.forEach(p => {
      const ring = TENSOR_RINGS[p.ringIndex];
      if (!ring) return;

      const r = ring.radius + p.radialOffset;
      const px = Math.cos(p.angle) * r;
      const pz = Math.sin(p.angle) * r;
      const py = -pz * Math.sin(ring.tiltX);
      const pzRot = pz * Math.cos(ring.tiltX);

      const proj = project3D(px, py, pzRot, cx, cy);

      ctx.fillStyle = ring.color;
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 4. SELECTOR DE CUADRANTES E INSPECTOR DE FÓRMULAS KaTeX
  // ══════════════════════════════════════════════════════════════════════════

  function selectSector(sectorKey, syncRadar = true) {
    const keyMap = {
      'graphrag': 'graphrag',
      'memory': 'graphrag',
      'colosseum': 'colosseum',
      'cognitive': 'colosseum',
      'bayesian': 'bayesian',
      'correlator': 'bayesian'
    };
    const normalizedKey = keyMap[sectorKey] || sectorKey;
    if (!SECTORS_DATA[normalizedKey] && !SECTORS_DATA[sectorKey]) return;
    const sector = SECTORS_DATA[normalizedKey] || SECTORS_DATA[sectorKey];
    currentSectorKey = normalizedKey;

    // Sincronizar con el nodo de radar 3D
    if (syncRadar && window.radarInstance) {
      window.radarInstance.selectNode(normalizedKey);
    }

    // Actualizar tabs activos
    document.querySelectorAll('.sector-tab').forEach(tab => {
      const tabKey = tab.dataset.sector;
      const tabNorm = keyMap[tabKey] || tabKey;
      if (tabNorm === normalizedKey || tabKey === sectorKey) {
        tab.classList.add('active');
        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        tab.classList.remove('active');
      }
    });

    // Actualizar panel lateral inspector
    const elBadge = document.getElementById('inspectorSectorBadge');
    const elTitle = document.getElementById('inspectorTitle');
    const elSub = document.getElementById('inspectorSubtitle');
    const elMetricsGrid = document.getElementById('inspectorMetricsGrid');
    const elSubsystems = document.getElementById('inspectorSubsystems');

    if (elBadge) {
      elBadge.textContent = sector.badge;
      elBadge.style.color = sector.color;
      elBadge.style.borderColor = sector.color;
    }
    if (elTitle) elTitle.textContent = sector.name;
    if (elSub) elSub.textContent = sector.subtitle;

    // Render de métricas en pill
    if (elMetricsGrid) {
      elMetricsGrid.innerHTML = sector.metrics.map(m => `
        <div class="metric-pill">
          <span class="lbl">${m.lbl}</span>
          <span class="val" style="color: ${sector.color}">${m.val}</span>
        </div>
      `).join('');
    }

    // Render de tarjetas de subsistemas y fórmulas
    if (elSubsystems) {
      elSubsystems.innerHTML = sector.subsystems.map(sub => `
        <div class="subsystem-card">
          <div class="subsystem-header">
            <span class="subsystem-name" style="color: ${sector.color}">${sub.name}</span>
            <span class="subsystem-meta">${sub.meta.split('/').pop()}</span>
          </div>
          <p class="subsystem-desc">${sub.desc}</p>
          <div class="formula-box">
            $$${sub.formula}$$
          </div>
          <div class="analogy-callout">
            <strong>Traducción a Ingeniería de Software:</strong>
            ${sub.analogy}
          </div>
        </div>
      `).join('');

      // Ejecutar render KaTeX sobre el contenedor con reintento si carga diferida
      const triggerKaTeX = (retries = 15) => {
        if (window.renderMathInElement) {
          window.renderMathInElement(elSubsystems, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        } else if (retries > 0) {
          setTimeout(() => triggerKaTeX(retries - 1), 100);
        }
      };
      triggerKaTeX();
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 5. INICIALIZACIÓN GENERAL Y CONTROLES
  // ══════════════════════════════════════════════════════════════════════════

  document.addEventListener('DOMContentLoaded', () => {
    initTelemetry();
    initCanvas();

    // Renderizar fórmulas KaTeX estáticas de la página
    const renderStaticMath = (retries = 15) => {
      if (window.renderMathInElement) {
        window.renderMathInElement(document.body, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      } else if (retries > 0) {
        setTimeout(() => renderStaticMath(retries - 1), 150);
      }
    };
    renderStaticMath();

    // Listeners de los tabs del selector
    document.querySelectorAll('.sector-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        selectSector(tab.dataset.sector);
      });
    });

    // Controles de escenario
    const btnPause = document.getElementById('btnPauseSim');
    const btnTrails = document.getElementById('btnToggleTrails');
    const btnReset = document.getElementById('btnResetCamera');

    if (btnPause) {
      btnPause.addEventListener('click', () => {
        isPaused = !isPaused;
        btnPause.classList.toggle('active', isPaused);
        btnPause.innerHTML = isPaused ? '▶ Reanudar' : '⏸ Pausar';
        if (window.radarInstance) {
          window.radarInstance.calib.simSpeed = isPaused ? 0 : 1;
        }
      });
    }

    if (btnTrails) {
      btnTrails.addEventListener('click', () => {
        showTrails = !showTrails;
        btnTrails.classList.toggle('active', showTrails);
        if (window.radarInstance) {
          window.radarInstance.calib.showTrails = showTrails;
        }
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        cameraTargetRot = { x: 0.45, y: -0.2 };
        if (window.radarInstance) {
          window.radarInstance.camera.targetRotX = 0.45;
          window.radarInstance.camera.targetRotY = -0.25;
          window.radarInstance.camera.panX = 0;
          window.radarInstance.camera.panY = 0;
          window.radarInstance.camera.targetZoom = 1.0;
        }
      });
    }

    // Listeners del filtro de capas del Diagrama Maestro
    const filterBtns = document.querySelectorAll('.filter-btn');
    const layerBlocks = document.querySelectorAll('.schematic-layer-block');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        filterBtns.forEach(b => b.classList.toggle('active', b === btn));

        layerBlocks.forEach(layer => {
          if (filter === 'all' || layer.dataset.layer === filter) {
            layer.style.display = 'block';
            if (filter !== 'all') {
              layer.classList.add('highlight');
              layer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
              layer.classList.remove('highlight');
            }
          } else {
            layer.style.display = 'none';
            layer.classList.remove('highlight');
          }
        });

        // Sincronizar foco y zoom reactivo en el Lienzo Vectorial
        if (filter !== 'all' && typeof window.focusLayerInDiagram === 'function') {
          window.focusLayerInDiagram(filter);
        }
      });
    });

    // Listeners de los pasos del pipeline macro (10 pasos sincronizados con las 10 capas)
    const macroSteps = document.querySelectorAll('.macro-step');
    const stepToLayerMap = [
      'layer-1', // PASO 01 -> Ingesta & MCKP
      'layer-0', // PASO 02 -> Rust Zero-GIL
      'layer-3', // PASO 03 -> DAG Ola 0 (76 Analizadores)
      'layer-2', // PASO 04 -> DAG Ola 1 (Orquestador & AFR)
      'layer-4', // PASO 05 -> Tensor S & ANS
      'layer-5', // PASO 06 -> Correlador Bayesiano
      'layer-6', // PASO 07 -> GraphRAG Merkle
      'layer-7', // PASO 08 -> Coliseo Multi-Agente
      'layer-8', // PASO 09 -> Git & Conway
      'layer-9'  // PASO 10 -> MCP & CI/CD
    ];

    macroSteps.forEach((step, idx) => {
      step.style.cursor = 'pointer';
      step.addEventListener('click', () => {
        macroSteps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');

        const targetLayer = stepToLayerMap[idx];
        const matchingBtn = document.querySelector(`.filter-btn[data-filter="${targetLayer}"]`);
        if (matchingBtn) {
          matchingBtn.click();
        }

        // Navegación inmediata en el lienzo
        if (typeof window.focusLayerInDiagram === 'function') {
          window.focusLayerInDiagram(targetLayer);
        }
      });
    });

    // ══════════════════════════════════════════════════════════════════════
    // INTERACCIÓN PAN-ZOOM EN EL LIENZO DEL DIAGRAMA MAESTRO (MERMAID)
    // ══════════════════════════════════════════════════════════════════════
    if (window.mermaid) {
      window.mermaid.initialize({
        startOnLoad: true,
        theme: 'dark',
        themeVariables: {
          darkMode: true,
          background: '#040711',
          primaryColor: '#0c1b33',
          primaryBorderColor: '#00f0ff',
          primaryTextColor: '#d8ecff',
          lineColor: '#00f0ff',
          secondaryColor: '#1a1030',
          tertiaryColor: '#0c2418',
          fontSize: '13px',
          fontFamily: "'JetBrains Mono', monospace"
        },
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: 'basis'
        }
      });
    }

    const diagCard = document.getElementById('lienzoVisualIntegral');
    const diagViewport = document.getElementById('diagramViewport');
    const diagStage = document.getElementById('diagramStage');
    const btnFit = document.getElementById('btnMermaidFit');
    const btnZoomIn = document.getElementById('btnMermaidZoomIn');
    const btnZoomOut = document.getElementById('btnMermaidZoomOut');
    const btnZoomReset = document.getElementById('btnMermaidZoomReset');
    const btnFullscreen = document.getElementById('btnMermaidFullscreen');

    if (diagViewport && diagStage) {
      let scale = 0.85;
      let panX = 40;
      let panY = 20;
      let isPanning = false;
      let startX = 0;
      let startY = 0;

      const updateTransform = () => {
        diagStage.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
        if (typeof updateMinimap === "function") updateMinimap();
      };

      const fitToViewport = () => {
        const svg = diagStage.querySelector('svg');
        if (!svg) return;

        let svgWidth = 1200;
        let svgHeight = 2000;

        try {
          if (typeof svg.getBBox === 'function') {
            const bbox = svg.getBBox();
            if (bbox && bbox.width > 50) {
              svgWidth = bbox.width;
              svgHeight = bbox.height;
            }
          }
        } catch (_) {}

        if (svgWidth <= 50 && svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width > 50) {
          svgWidth = svg.viewBox.baseVal.width;
          svgHeight = svg.viewBox.baseVal.height;
        }

        const vWidth = diagViewport.clientWidth || 1100;
        const vHeight = diagViewport.clientHeight || 740;
        const padX = 60;
        const targetScale = Math.min((vWidth - padX) / svgWidth, 1.15);

        scale = Math.min(Math.max(targetScale, 0.25), 1.25);
        panX = Math.round((vWidth - (svgWidth * scale)) / 2);
        panY = 30; // Centrado horizontal, flujo inicia en la parte superior
        updateTransform();
      };

      // Zoom In
      if (btnZoomIn) {
        btnZoomIn.addEventListener('click', () => {
          scale = Math.min(scale * 1.2, 3.0);
          updateTransform();
        });
      }

      // Zoom Out
      if (btnZoomOut) {
        btnZoomOut.addEventListener('click', () => {
          scale = Math.max(scale / 1.2, 0.2);
          updateTransform();
        });
      }

      // Fit to Screen
      if (btnFit) {
        btnFit.addEventListener('click', fitToViewport);
      }

      // Reset to 100% scale
      if (btnZoomReset) {
        btnZoomReset.addEventListener('click', () => {
          scale = 1.0;
          const vWidth = diagViewport.clientWidth || 1100;
          const svg = diagStage.querySelector('svg');
          const svgW = svg ? (svg.getBoundingClientRect().width / (scale || 1)) : 1100;
          panX = Math.round((vWidth - svgW) / 2);
          panY = 30;
          updateTransform();
        });
      }

      // Fullscreen Toggle
      if (btnFullscreen && diagCard) {
        btnFullscreen.addEventListener('click', () => {
          const isFull = diagCard.classList.toggle('is-fullscreen');
          btnFullscreen.innerHTML = isFull ? '✕ Salir' : '⛶ Pantalla Completa';
          btnFullscreen.classList.toggle('active', isFull);
          document.body.style.overflow = isFull ? 'hidden' : '';
          setTimeout(fitToViewport, 120);
        });

        window.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && diagCard.classList.contains('is-fullscreen')) {
            diagCard.classList.remove('is-fullscreen');
            btnFullscreen.innerHTML = '⛶ Pantalla Completa';
            btnFullscreen.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(fitToViewport, 120);
          }
        });
      }

      // Mouse Wheel: solo hace zoom con Ctrl/Meta, permitiendo scroll normal sin trabas!
      diagViewport.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const rect = diagViewport.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          const factor = e.deltaY < 0 ? 1.12 : 0.89;
          const newScale = Math.min(Math.max(scale * factor, 0.2), 3.0);
          
          panX = mouseX - (mouseX - panX) * (newScale / scale);
          panY = mouseY - (mouseY - panY) * (newScale / scale);
          scale = newScale;
          updateTransform();
        }
      }, { passive: false });

      // Pan con mouse drag
      diagViewport.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) return;
        isPanning = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
        diagViewport.style.cursor = 'grabbing';
      });

      window.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        updateTransform();
      });

      window.addEventListener('mouseup', () => {
        if (isPanning) {
          isPanning = false;
          if (diagViewport) diagViewport.style.cursor = 'grab';
        }
      });

      // Gestos Touch para móviles y tablets
      let initialPinchDist = null;
      let initialPinchScale = scale;

      diagViewport.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          isPanning = true;
          startX = e.touches[0].clientX - panX;
          startY = e.touches[0].clientY - panY;
        } else if (e.touches.length === 2) {
          isPanning = false;
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          initialPinchDist = Math.hypot(dx, dy);
          initialPinchScale = scale;
        }
      }, { passive: true });

      diagViewport.addEventListener('touchmove', (e) => {
        if (isPanning && e.touches.length === 1) {
          panX = e.touches[0].clientX - startX;
          panY = e.touches[0].clientY - startY;
          updateTransform();
        } else if (e.touches.length === 2 && initialPinchDist) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const dist = Math.hypot(dx, dy);
          const ratio = dist / initialPinchDist;
          scale = Math.min(Math.max(initialPinchScale * ratio, 0.2), 3.0);
          updateTransform();
        }
      }, { passive: true });

      diagViewport.addEventListener('touchend', () => {
        isPanning = false;
        initialPinchDist = null;
      });

      
    
    // ══════════════════════════════════════════════════════════════════════
    // MATRIZ DE CONOCIMIENTO FORENSE: REGISTRO MAESTRO DE LOS 46 COMPONENTES
    // ══════════════════════════════════════════════════════════════════════
    const NODES_BLUEPRINT_REGISTRY = {
  "RS_CORE": {
    "name": "archangel_rs Core: Runtime Nativo",
    "layer": "CAPA 00 // NATIVO RUST ZERO-GIL",
    "file": "archangel_rs/src/lib.rs",
    "algo": "Sustrato Binario Multihilo Zero-GIL",
    "formula": "T_{\\text{exec}} \\le 1.2\\text{ms} \\quad \\text{con } \\text{GIL} = \\emptyset",
    "desc": "Núcleo de alto rendimiento compilado en Rust nativo con perfiles LTO y AVX2. Proporciona ejecución paralela sin contención de GIL de Python, administrando la memoria compartida POSIX y despachando tareas a los decodificadores de bytecode.",
    "metrics": {
      "Complejidad": "O(1) IPC",
      "Latencia": "< 2.0ms",
      "Memoria": "Zero-Copy Slabs",
      "Garantía": "Memory-Safe Rust"
    },
    "radarSector": "rust"
  },
  "RS_EVM": {
    "name": "evm.rs: Verificador SWC-107, 115, 104",
    "layer": "CAPA 00 // NATIVO RUST ZERO-GIL",
    "file": "archangel_rs/src/evm.rs",
    "algo": "Deconstrucción de Bytecode & Reentrancy DFA",
    "formula": "\\text{PC} \\to \\text{Opcode} \\implies \\text{SimulatedCallStack}(gas, storage\\_slots)",
    "desc": "Decodifica bytecode EVM en crudo, elimina metadatos CBOR y detecta reentrancia (SWC-107), bypass de tx.origin (SWC-115) y llamadas no controladas sin requerir ejecución simbólica pesada.",
    "metrics": {
      "Complejidad": "O(N) Opcodes",
      "Latencia": "< 5.0ms",
      "Memoria": "840 KB Heap",
      "Garantía": "Sin Falsos Positivos"
    },
    "radarSector": "rust"
  },
  "RS_WASM": {
    "name": "wasm.rs: Auditor CosmWasm Storage",
    "layer": "CAPA 00 // NATIVO RUST ZERO-GIL",
    "file": "archangel_rs/src/wasm.rs",
    "algo": "Binary WebAssembly Parser & Table Dispatch Matching",
    "formula": "\\text{WASM\\_SECTION\\_ELEMENT} \\xrightarrow{\\text{table}} env.db\\_write \\cap \\text{Guard}(memcmp)",
    "desc": "Inspecciona secciones binarias de WebAssembly (CosmWasm / Near / Polkadot). Resuelve el despacho indirecto de la tabla de elementos y garantiza que las escrituras a almacenamiento persistente posean guardas de identidad criptográfica.",
    "metrics": {
      "Complejidad": "O(Section Size)",
      "Latencia": "< 3.8ms",
      "Memoria": "Heapless Arena",
      "Garantía": "Verificación de Tipos"
    },
    "radarSector": "rust"
  },
  "RS_PTS": {
    "name": "race_pts.rs: Andersen Points-To Field-Sensitive",
    "layer": "CAPA 00 // NATIVO RUST ZERO-GIL",
    "file": "archangel_rs/src/race_pts.rs",
    "algo": "Andersen Points-To 1-Obj Context & Bitsets FxHash",
    "formula": "pts(p) \\supseteq pts(q) \\iff p = q; \\quad pts(p) \\supseteq \\{o\\} \\iff p = \\&o",
    "desc": "Análisis interprocedural de puntos-a con sensibilidad de contexto de 1 objeto y uniones de bitsets aceleradas con FxHash. Determina alias estáticos para detectar carreras de datos concurrentes.",
    "metrics": {
      "Complejidad": "O(V^3) peor, O(V) medio",
      "Latencia": "< 7.5ms",
      "Memoria": "Bitset Compacto",
      "Garantía": "1-CFA Sound"
    },
    "radarSector": "rust"
  },
  "RS_DEAD": {
    "name": "deadlock_cfg.rs: Ciclos Lock Graph O(V+E)",
    "layer": "CAPA 00 // NATIVO RUST ZERO-GIL",
    "file": "archangel_rs/src/deadlock_cfg.rs",
    "algo": "Tarjan Strongly Connected Components en Lock Ordering",
    "formula": "G = (V_{\\text{locks}}, E_{\\text{acquire}}) \\implies \\text{SCC}(G) \\neq \\emptyset \\iff \\text{Deadlock}",
    "desc": "Construye el grafo dirigido de adquisición de cerraduras (mutex, rwlock, semáforos) y calcula componentes fuertemente conexas en tiempo lineal. Detecta interbloqueos antes de que el código llegue a producción.",
    "metrics": {
      "Complejidad": "O(V + E) Lineal",
      "Latencia": "< 2.4ms",
      "Memoria": "320 KB Stack",
      "Garantía": "DAG Acíclico"
    },
    "radarSector": "rust"
  },
  "RS_SHM": {
    "name": "POSIX Slabs /dev/shm IPC Zero-Copy",
    "layer": "CAPA 00 // NATIVO RUST ZERO-GIL",
    "file": "archangel_rs/src/shm.rs",
    "algo": "Lock-Free Shared Memory Ring Buffer",
    "formula": "\\text{Buffer} \\subset \\text{/dev/shm/archangel\\_ipc} \\quad [\\text{CAS Atomic Pointers}]",
    "desc": "Mapeo de memoria compartida POSIX entre el daemon en Python y los motores nativos en Rust. Elimina la serialización JSON/Pickle mediante slabs binarios tipados con punteros atómicos compare-and-swap.",
    "metrics": {
      "Complejidad": "O(1) Enqueue/Dequeue",
      "Latencia": "< 400ns",
      "Throughput": "> 2.4 GB/s",
      "Garantía": "Zero-Copy Buffer"
    },
    "radarSector": "rust"
  },
  "IN_SRC": {
    "name": "Repositorio y Archivos Fuente",
    "layer": "CAPA 01 // INGESTIÓN POLÍGLOTA & UNIVERSAL IR",
    "file": "Workspace Virtual File System (VFS)",
    "algo": "Git Delta Diff Scanner & Incremental Watcher",
    "formula": "\\Delta_{\\text{workspace}} = \\text{Tree}(\\text{HEAD}) \\oplus \\text{Tree}(\\text{Index})",
    "desc": "Punto de entrada de los archivos del proyecto. Monitorea cambios incrementales en el árbol de trabajo mediante eventos inotify/FSEvents para evitar reanalizar código que no ha mutado.",
    "metrics": {
      "Complejidad": "O(Archivos)",
      "Latencia": "< 15ms",
      "Escalabilidad": "> 100k Files",
      "Garantía": "Idempotencia"
    },
    "radarSector": "semantics"
  },
  "IN_INC": {
    "name": "Inception Parser: SQL, Regex, GraphQL anidados",
    "layer": "CAPA 01 // INGESTIÓN POLÍGLOTA & UNIVERSAL IR",
    "file": "core/ir/inception_parser.py",
    "algo": "Multi-Grammar Embedded String Parsing",
    "formula": "\\mathcal{G}_{\\text{inception}} = \\mathcal{G}_{\\text{Host}} \\cup \\mathcal{G}_{\\text{SQL}} \\cup \\mathcal{G}_{\\text{Regex}} \\cup \\mathcal{G}_{\\text{GraphQL}}",
    "desc": "Extrae lenguajes embebidos dentro de cadenas de texto y templates del código anfitrión. Detecta inyecciones SQL en raw queries, expresiones regulares catastróficas (ReDoS) y schemas GraphQL.",
    "metrics": {
      "Complejidad": "O(Tokens)",
      "Latencia": "< 12ms",
      "Gramáticas": "4 Lenguajes Hijos",
      "Garantía": "Lossless AST"
    },
    "radarSector": "semantics"
  },
  "IN_LANG": {
    "name": "Kernel 15 Lenguajes Políglota",
    "layer": "CAPA 01 // INGESTIÓN POLÍGLOTA & UNIVERSAL IR",
    "file": "core/parsers/lang_kernel.py",
    "algo": "Universal AST Normalizer & Syntax Diagnostics",
    "formula": "15 \\times \\text{Langs: Python, TS, Rust, Go, C++, Solidity, Move, Ruby...}",
    "desc": "Motor de análisis sintáctico que homogeneiza árboles de sintaxis abstracta de 15 tecnologías en una representación intermedia común (Universal IR), preservando tipos y ámbitos.",
    "metrics": {
      "Complejidad": "O(Tokens)",
      "Latencia": "< 25ms",
      "Soporte": "15 Lenguajes",
      "Garantía": "Normalización Tipada"
    },
    "radarSector": "semantics"
  },
  "IN_MCKP": {
    "name": "Optimizador MCKP (Mochila de Tokens)",
    "layer": "CAPA 01 // INGESTIÓN POLÍGLOTA & UNIVERSAL IR",
    "file": "core/ir/mckp_solver.py",
    "algo": "Multiple-Choice Knapsack Dynamic Programming",
    "formula": "\\max \\sum_{i,j} v_{ij} x_{ij} \\quad \\text{sujeto a} \\quad \\sum_{i,j} w_{ij} x_{ij} \\le B_{\\text{tokens}}",
    "desc": "Resuelve el problema de la mochila de elección múltiple para podar el contexto de código que se enviará a LLMs, garantizando que el presupuesto de tokens capture los fragmentos más críticos.",
    "metrics": {
      "Complejidad": "O(N · B) Pseudo-polinomial",
      "Latencia": "< 6.0ms",
      "Ahorro Tokens": "-68% Overhead",
      "Garantía": "Valor Óptimo"
    },
    "radarSector": "cybernetics"
  },
  "IN_SLICE": {
    "name": "Surgical Slicer PDG",
    "layer": "CAPA 01 // INGESTIÓN POLÍGLOTA & UNIVERSAL IR",
    "file": "core/ir/surgical_slicer.py",
    "algo": "Backward & Forward Program Dependence Slicing",
    "formula": "\\text{Slice}(v) = \\{ u \\in PDG \\mid u \\to^* v \\lor v \\to^* u \\}",
    "desc": "Aísla la clausura causal mínima de un defecto en el grafo de dependencias de programa (PDG). Extrae únicamente las variables y bifurcaciones que influyen en el punto de fallo.",
    "metrics": {
      "Complejidad": "O(V + E)",
      "Latencia": "< 9.2ms",
      "Precisión": "Slicing Semántico",
      "Garantía": "Clausura Mínima"
    },
    "radarSector": "physics"
  },
  "DAG_ENG": {
    "name": "dag_engine.py: Planificador de Olas Topológicas",
    "layer": "CAPA 02 // ORQUESTADOR DAG BIFÁSICO & AFR",
    "file": "core/analyzers/registry/dag_engine.py",
    "algo": "Kahn Topological Sorting & Wave Partitioning",
    "formula": "\\mathcal{W}_0 = \\{ A \\mid \\text{in\\_deg}(A) = 0 \\}, \\quad \\mathcal{W}_1 = \\{ A \\mid \\text{deps}(A) \\subseteq \\mathcal{W}_0 \\}",
    "desc": "Organiza los 76 analizadores en olas de ejecución independientes de dependencias. Despacha la Ola 0 en paralelo masivo sobre núcleos de CPU y sincroniza la Ola 1 de segundo orden.",
    "metrics": {
      "Complejidad": "O(V + E)",
      "Latencia": "< 2.1ms",
      "Concurrencia": "76 Analizadores",
      "Garantía": "Sin Deadlocks"
    },
    "radarSector": "cybernetics"
  },
  "AFR": {
    "name": "flight_recorder.py: Auditoría Cripto SHA-256",
    "layer": "CAPA 02 // ORQUESTADOR DAG BIFÁSICO & AFR",
    "file": "core/analyzers/registry/flight_recorder.py",
    "algo": "Append-Only Cryptographic Audit Log",
    "formula": "H_k = \\text{SHA256}(H_{k-1} \\,\\|\\, \\text{Event}_k \\,\\|\\, \\text{Timestamp})",
    "desc": "Caja negra criptográfica inmutable. Registra cada fase, micro-tiempo de ejecución y hash de entrada/salida de cada analizador para asegurar trazabilidad forense y reproducibilidad matemática.",
    "metrics": {
      "Complejidad": "O(1) Append",
      "Latencia": "< 45µs",
      "Integridad": "Cadena SHA-256",
      "Garantía": "Tamper-Evident"
    },
    "radarSector": "cybernetics"
  },
  "CB": {
    "name": "health.py: Circuit Breakers & Failure Budgets",
    "layer": "CAPA 02 // ORQUESTADOR DAG BIFÁSICO & AFR",
    "file": "core/analyzers/registry/health.py",
    "algo": "Leaky Bucket Circuit Breaker & Error Budgets",
    "formula": "\\text{State} = \\begin{cases} \\text{Abierto} & \\text{si } \\text{fail\\_rate} > 0.05 \\\\ \\text{Cerrado} & \\text{nominal} \\end{cases}",
    "desc": "Protege el daemon de analizadores inestables o que consuman memoria excesiva. Aisla caídas y cancela hilos rezagados mediante tokens cooperativos sin detener el escaneo global.",
    "metrics": {
      "Complejidad": "O(1)",
      "Latencia": "< 10µs",
      "Tolerancia": "Aislamiento de Fallas",
      "Garantía": "Daemon Blindado"
    },
    "radarSector": "cybernetics"
  },
  "F_PHYS": {
    "name": "Familia Física Esotérica (16 Analizadores)",
    "layer": "CAPA 03 // OLA 0: 76 ANALIZADORES PARALELOS",
    "file": "core/analyzers/physics/",
    "algo": "AdS/CFT Holography, SQA Quantum Annealing, Lorentz Filters",
    "formula": "S_{\\text{bulk}} \\le \\frac{c^3 k}{4 G \\hbar} A \\quad \\text{y} \\quad \\mathcal{H}_{SQA} = \\sum_p \\left[ \\mathcal{H}_{QUBO}(s^{(p)}) - J_\\perp s_i^{(p)} s_i^{(p+1)} \\right]",
    "desc": "Mapea el software como un sistema físico continuo: singularidades de Schwarzschild en archivos gigantes (holographic_black_hole), recocido cuántico Trotter P=8 (quantum_annealer), y filtros de barrera de Maxwell.",
    "metrics": {
      "Analizadores": "16 Especializados",
      "Latencia": "< 42ms",
      "Despacho": "Ola 0 Paralela",
      "Garantía": "Modelado Termodinámico"
    },
    "radarSector": "physics"
  },
  "F_RULE": {
    "name": "Familia Reglas Sistémicas (12 Analizadores)",
    "layer": "CAPA 03 // OLA 0: 76 ANALIZADORES PARALELOS",
    "file": "core/analyzers/rules/",
    "algo": "Panarchy r-K-Ω-α, Ashby Variety, Shannon Channel Capacity",
    "formula": "C = B \\cdot \\log_2\\left(1 + \\frac{S}{N}\\right) \\quad \\text{y} \\quad V_{\\text{ctrl}} \\ge V_{\\text{sys}}",
    "desc": "Formaliza principios de cibernética y teoría general de sistemas: resiliencia adaptativa de Panaquía, límites de información de Shannon y mamparos de percolación de Molloy-Reed.",
    "metrics": {
      "Analizadores": "12 Especializados",
      "Latencia": "< 28ms",
      "Despacho": "Ola 0 Paralela",
      "Garantía": "Teoremas Cibernéticos"
    },
    "radarSector": "cybernetics"
  },
  "F_SEM": {
    "name": "Familia Semántica & Refactor (14 Analizadores)",
    "layer": "CAPA 03 // OLA 0: 76 ANALIZADORES PARALELOS",
    "file": "core/analyzers/semantics/",
    "algo": "Michael Feathers 6 Seams, GroEL Chaperone, Cryogenic Purity",
    "formula": "\\tau(f) = 1.0 - \\exp\\left(-1.25 \\cdot E(f)\\right) \\quad \\text{con } T = 0\\text{ K}",
    "desc": "Identificación de costuras arquitectónicas para testing, chaperón molecular GroEL/GroES de 14 ATP para replegado de métodos, validación criogénica al Cero Absoluto (pureza referencial).",
    "metrics": {
      "Analizadores": "14 Especializados",
      "Latencia": "< 34ms",
      "Despacho": "Ola 0 Paralela",
      "Garantía": "Preservación de Semántica"
    },
    "radarSector": "semantics"
  },
  "F_TOP": {
    "name": "Familia Topología & Taint (14 Analizadores)",
    "layer": "CAPA 03 // OLA 0: 76 ANALIZADORES PARALELOS",
    "file": "core/analyzers/topology/",
    "algo": "Charset Bigram Entropy Secret Engine, Temporal Taint",
    "formula": "H(X) = -\\sum p(x_i) \\log_2 p(x_i) \\quad \\text{con Markov } P(c_i \\mid c_{i-1})",
    "desc": "Motor de detección de secretos con entropía consciente del juego de caracteres y transiciones de bigramas. Rastreo temporal de variables contaminadas e inspección de interfaces públicas.",
    "metrics": {
      "Analizadores": "14 Especializados",
      "Latencia": "< 19ms",
      "Despacho": "Ola 0 Paralela",
      "Garantía": "Cero Fugas de Secretos"
    },
    "radarSector": "rust"
  },
  "F_MET": {
    "name": "Familia Métricas & Sociotécnico (10 Analizadores)",
    "layer": "CAPA 03 // OLA 0: 76 ANALIZADORES PARALELOS",
    "file": "core/analyzers/metrics/",
    "algo": "Wöhler Panic Fatigue, Bus Factor Post-Roast, Churn Entropy",
    "formula": "\\sigma_a = \\sigma_f\\' (2 N_f)^b \\quad \\text{Fatiga de Material de Software}",
    "desc": "Monitoreo de fatiga de desarrolladores según horarios de commits, cálculo de bus factor real y entropía de modificaciones en el repositorio git para predecir puntos de quiebre humano.",
    "metrics": {
      "Analizadores": "10 Especializados",
      "Latencia": "< 38ms",
      "Despacho": "Ola 0 Paralela",
      "Garantía": "Forense Sociotécnico"
    },
    "radarSector": "cybernetics"
  },
  "F_IR": {
    "name": "Familia IR & Grafos Globales (10 Analizadores)",
    "layer": "CAPA 03 // OLA 0: 76 ANALIZADORES PARALELOS",
    "file": "core/analyzers/ir/",
    "algo": "CFG Builder, PDG Generator, Callgraph Synthesis, SSA Form",
    "formula": "CFG = (B, E), \\quad PDG = (V, E_{\\text{data}} \\cup E_{\\text{control}})",
    "desc": "Síntesis de grafos de flujo de control, dependencias de programa y llamadas interprocedurales a escala completa de repositorio, construyendo la base topológica del sistema.",
    "metrics": {
      "Analizadores": "10 Especializados",
      "Latencia": "< 26ms",
      "Despacho": "Ola 0 Paralela",
      "Garantía": "Forma SSA Estricta"
    },
    "radarSector": "physics"
  },
  "F_ROW1": {
    "name": "Fila 1: Física, Reglas Sistémicas & Semántica (38 Analizadores)",
    "layer": "CAPA 03 // OLA 0: 76 ANALIZADORES PARALELOS",
    "file": "core/analyzers/{physics,rules,semantics}/",
    "algo": "Concurrencia Embarazosamente Paralela sobre AST Compartido",
    "formula": "\\mathcal{W}_0 = \\bigcup_{i=1}^{38} \\mathcal{A}_i(\\text{AST}) \\quad [O(1) \\text{ Lock-Free Read}]",
    "desc": "Primera mitad de la Ola 0: 38 analizadores ejecutados concurrentemente que escanean agujeros negros holográficos, recocido cuántico SQA, Panaquía, Ashby, Prigogine y costuras de refactorización.",
    "metrics": {
      "Analizadores": "38 en Paralelo",
      "Latencia Media": "< 32ms",
      "Despacho": "Ola 0 (CPU Bound)",
      "Modo Memoria": "AST Index Read-Only"
    },
    "radarSector": "physics"
  },
  "F_ROW2": {
    "name": "Fila 2: Topología, Métricas Sociotécnicas & Universal IR (38 Analizadores)",
    "layer": "CAPA 03 // OLA 0: 76 ANALIZADORES PARALELOS",
    "file": "core/analyzers/{topology,metrics,ir}/",
    "algo": "Inferencia Topológica, Detección de Secretos y Forense Sociotécnico",
    "formula": "\\mathcal{W}_0' = \\bigcup_{j=39}^{76} \\mathcal{A}_j(\\text{AST, Git}) \\quad [\\text{Throughput: } 100k \\text{ LOC/s}]",
    "desc": "Segunda mitad de la Ola 0: 38 analizadores que investigan grafos de flujo (CFG/PDG), superficies de API, entropía de credenciales, decaimiento de Ebbinghaus y fatiga de Wöhler.",
    "metrics": {
      "Analizadores": "38 en Paralelo",
      "Latencia Media": "< 35ms",
      "Despacho": "Ola 0 (I/O & CPU)",
      "Modo Memoria": "Lock-Free Slabs"
    },
    "radarSector": "cybernetics"
  },
  "SHM_BUF": {
    "name": "POSIX Shm Ring Buffer (Ola 0)",
    "layer": "CAPA 04 // OLA 1: ANALIZADORES DE SEGUNDO ORDEN",
    "file": "core/engine/workers.py",
    "algo": "POSIX Shared Memory Ring Buffer Signal Accumulator",
    "formula": "\\mathcal{B}_{\\text{signals}} = \\bigcup_{i=1}^{76} \\text{Signals}(\\mathcal{A}_i) \\in \\text{/dev/shm}",
    "desc": "Buffer anular de memoria compartida que recolecta todas las anomalías y métricas producidas por los 76 analizadores de la Ola 0, sirviendo de entrada para los analizadores dependientes.",
    "metrics": {
      "Complejidad": "O(1) Enqueue",
      "Latencia": "< 1.1ms",
      "Capacidad": "100,000 Señales",
      "Garantía": "Punteros Atómicos"
    },
    "radarSector": "rust"
  },
  "W1_CONWAY": {
    "name": "conway_analyzer: Brecha Sociotécnica",
    "layer": "CAPA 04 // OLA 1: ANALIZADORES DE SEGUNDO ORDEN",
    "file": "core/analyzers/metrics/conway_analyzer.py",
    "algo": "Graph Distance: Git Communications vs Code Architecture",
    "formula": "\\text{Mismatch} = \\| G_{\\text{code}} - G_{\\text{human}} \\|_{\\text{Frobenius}}",
    "desc": "Cruza el grafo de comunicación de desarrolladores en Git con la topología real de módulos del código. Detecta desalineaciones que violan la Ley de Conway e inducen fricción arquitectónica.",
    "metrics": {
      "Complejidad": "O(N^2)",
      "Latencia": "< 24ms",
      "Datos": "Grafos Cruzados",
      "Garantía": "Ley de Conway"
    },
    "radarSector": "cybernetics"
  },
  "W1_FLOWS": {
    "name": "dangerous_flows: Taint Cruzado Inter-Procedimental",
    "layer": "CAPA 04 // OLA 1: ANALIZADORES DE SEGUNDO ORDEN",
    "file": "core/analyzers/topology/dangerous_flows.py",
    "algo": "Whole-Program Inter-Procedural Taint Reachability",
    "formula": "\\text{TaintSource}(s) \\xrightarrow{\\text{call}^*} \\text{TaintSink}(e) \\implies \\text{Alerta Crítica}",
    "desc": "Propaga manchas de datos no confiables a través de llamadas de funciones en múltiples módulos y paquetes externos, detectando inyecciones remotas que escapan a analizadores locales.",
    "metrics": {
      "Complejidad": "O(V + E)",
      "Latencia": "< 32ms",
      "Rango": "Inter-módulo",
      "Garantía": "Sin Salto de Taint"
    },
    "radarSector": "rust"
  },
  "TENSOR": {
    "name": "Tensor de Estrés Dinámico S",
    "layer": "CAPA 05 // TENSOR DE ESTRÉS S & SISTEMA NERVIOSO (ANS)",
    "file": "core/engine/unified_risk.py",
    "algo": "7-Dimensional Dynamic Software Stress Tensor",
    "formula": "\\mathcal{S} = \\begin{pmatrix} \\sigma_{ff} & \\sigma_{fc} & \\dots \\\\ \\sigma_{cf} & \\sigma_{cc} & \\dots \\end{pmatrix} \\in \\mathbb{R}^{7 \\times 7}, \\quad \\text{Traza}(\\mathcal{S}) \\to \\Phi",
    "desc": "Matriz tensorial que consolida 7 dimensiones ortogonales de riesgo de software (Fractura, Concurrencia, Entropía, Conway, Infección, Asincronía, Cripto) en un tensor dinámico unificado.",
    "metrics": {
      "Dimensiones": "7D x 13 Escalares",
      "Latencia": "< 480µs",
      "Operación": "NumPy Vectorizado",
      "Garantía": "Espacio Métrico Hermítico"
    },
    "radarSector": "physics"
  },
  "SSI": {
    "name": "Software Stability Index: SSI = 100·(1-Φ)",
    "layer": "CAPA 05 // TENSOR DE ESTRÉS S & SISTEMA NERVIOSO (ANS)",
    "file": "core/engine/unified_risk.py",
    "algo": "Global Stability Scalar Formulation",
    "formula": "SSI = 100 \\cdot \\left(1.0 - \\Phi_{\\text{stress}}\\right) \\in [0.0, 100.0]",
    "desc": "Métrica escalar soberana de estabilidad del código. Varía de 0.0 (colapso estructural inminente) a 100.0 (código matemáticamente cristalino y formalmente verificado).",
    "metrics": {
      "Rango": "0.0 - 100.0",
      "Latencia": "< 15µs",
      "Sensibilidad": "Reactividad Instantánea",
      "Garantía": "Escalar Acotado"
    },
    "radarSector": "cybernetics"
  },
  "ANS_FAST": {
    "name": "ANS Simpático (< 50ms Reflex)",
    "layer": "CAPA 05 // TENSOR DE ESTRÉS S & SISTEMA NERVIOSO (ANS)",
    "file": "core/actions/autonomic_nervous_system/sympathetic.py",
    "algo": "Sub-50ms Ultra-Fast Emergency Reflex Gate",
    "formula": "t_{\\text{reflex}} \\le 50\\text{ms} \\implies \\text{Drop PR / Kill Rogue Process}",
    "desc": "Mecanismo de reflejo ultrarrápido equivalente al sistema simpático biológico. Cuando el tensor detecta una fractura crítica o fuga de memoria activa, corta la transacción en menos de 50ms.",
    "metrics": {
      "Latencia": "< 35ms",
      "Acción": "Bloqueo Inmediato",
      "Prioridad": "Kernel Level",
      "Garantía": "Tiempo Real Duro"
    },
    "radarSector": "cybernetics"
  },
  "ANS_COLD": {
    "name": "ANS Parasimpático (Cicatrización Fría)",
    "layer": "CAPA 05 // TENSOR DE ESTRÉS S & SISTEMA NERVIOSO (ANS)",
    "file": "core/actions/autonomic_nervous_system/parasympathetic.py",
    "algo": "Cold Worktree Healing & Background Homeostasis",
    "formula": "\\text{Worktree}_{\\text{isolated}} \\xrightarrow{\\text{synthesize}} \\text{Verified Patch}",
    "desc": "Regulación parasimpática en reposo. Crea git worktrees aislados en segundo plano para aplicar parches de refactorización sintética, probarlos en sandbox y retornarlos validados.",
    "metrics": {
      "Modo": "Background Autónomo",
      "Aislamiento": "Worktree Separado",
      "Seguridad": "Sandbox Seguro",
      "Garantía": "Master Intacto"
    },
    "radarSector": "semantics"
  },
  "CLONALG": {
    "name": "CLONALG Inmune & MCTS MDP",
    "layer": "CAPA 05 // TENSOR DE ESTRÉS S & SISTEMA NERVIOSO (ANS)",
    "file": "core/actions/autonomic_nervous_system/clonalg.py",
    "algo": "Clonal Selection Algorithm & Monte Carlo Tree Search",
    "formula": "N_{\\text{clones}} = \\text{round}\\left(\\frac{\\beta \\cdot N}{i}\\right) \\quad \\text{y} \\quad Q(s,a) = R + \\gamma \\max Q(s\\',a\\')",
    "desc": "Aplica el algoritmo de selección clonal de De Castro y Von Zuben para generar y mutar anticuerpos de parche frente a vectores de fallo, guiado por un planificador MCTS en un MDP de Bellman.",
    "metrics": {
      "Algoritmo": "Inmunocomputación",
      "Planificador": "MCTS Bellman",
      "Generaciones": "10-50 Epochs",
      "Garantía": "Afinidad Óptima"
    },
    "radarSector": "cybernetics"
  },
  "BELLMAN": {
    "name": "Retículo Booleano: Bellman DP Exacto",
    "layer": "CAPA 06 // CORRELADOR BAYESIANO V3 & SÍNTESIS",
    "file": "core/analyzers/correlator/bellman.py",
    "algo": "Exact Dynamic Programming over Boolean Lattice {0,1}^k",
    "formula": "V(S) = \\min_{a \\in \\mathcal{A}(S)} \\left[ c(S, a) + \\sum_{S\\'} P(S\\' \\mid S, a) V(S\\') \\right]",
    "desc": "Calcula la política óptima de resolución de advertencias evaluando el retículo booleano de $2^k$ estados de correlación. Encuentra el camino de mínima energía para eliminar la deuda técnica.",
    "metrics": {
      "Complejidad": "O(2^k) con k<=12",
      "Latencia": "< 14ms",
      "Espacio": "Bitsets Compactos",
      "Garantía": "Mínimo Global Exacto"
    },
    "radarSector": "physics"
  },
  "SHAPLEY": {
    "name": "Valores Shapley & Bouma NPMI",
    "layer": "CAPA 06 // CORRELADOR BAYESIANO V3 & SÍNTESIS",
    "file": "core/analyzers/correlator/shapley.py",
    "algo": "Cooperative Game Theory & Normalized Pointwise Mutual Info",
    "formula": "\\phi_i(v) = \\sum_{S \\subseteq N \\setminus \\{i\\}} \\frac{|S|!(|N|-|S|-1)!}{|N|!} (v(S \\cup \\{i\\}) - v(S))",
    "desc": "Asigna de forma justa e inalterable el peso de responsabilidad de cada analizador en la puntuación de riesgo total, eliminando sesgos de analizadores demasiado ruidosos.",
    "metrics": {
      "Teoría": "Juegos Cooperativos",
      "Latencia": "< 16ms",
      "Métrica Co-ocurrencia": "Bouma NPMI",
      "Garantía": "Axiomas de Shapley"
    },
    "radarSector": "cybernetics"
  },
  "COLLAPSE": {
    "name": "collapse.py: Supresión Ruido -80%",
    "layer": "CAPA 06 // CORRELADOR BAYESIANO V3 & SÍNTESIS",
    "file": "core/analyzers/correlator/collapse.py",
    "algo": "Semantic Signal Collapse & Alert Fatigue Clustering",
    "formula": "\\text{Cluster}(s_i, s_j) \\iff \\text{Cosine}(\\vec{e}_i, \\vec{e}_j) \\ge 0.88 \\lor \\text{SameASTSlice}",
    "desc": "Colapsa alertas redundantes que se refieren a la misma causa raíz en un único hallazgo enriquecido. Reduce la fatiga de alertas del desarrollador en más de un 80%.",
    "metrics": {
      "Reducción": "-80% Ruido",
      "Latencia": "< 7.8ms",
      "Clustering": "Semántico + AST",
      "Garantía": "Cero Pérdida de Causa Raíz"
    },
    "radarSector": "cybernetics"
  },
  "RACE": {
    "name": "concurrency_evidence: 3 Peldaños",
    "layer": "CAPA 06 // CORRELADOR BAYESIANO V3 & SÍNTESIS",
    "file": "core/analyzers/correlator/concurrency_evidence.py",
    "algo": "Triple Ladder Concurrency Verification",
    "formula": "\\text{Evidencia} = \\text{Acceso AST} \\land \\text{Alias Points-To} \\land \\text{Interleaving Temporal}",
    "desc": "Exige que una condición de carrera satisfaga simultáneamente los 3 peldaños de la escalera probatoria: acceso concurrente AST, colisión de alias en points-to y solapamiento temporal de hilos.",
    "metrics": {
      "Peldaños": "3 Niveles",
      "Latencia": "< 9.5ms",
      "Falsos Positivos": "0.00%",
      "Garantía": "Evidencia Triangulada"
    },
    "radarSector": "rust"
  },
  "FIX_SYNTH": {
    "name": "fix_synthesis: Síntesis Remediación",
    "layer": "CAPA 06 // CORRELADOR BAYESIANO V3 & SÍNTESIS",
    "file": "core/analyzers/correlator/fix_synthesis.py",
    "algo": "Unified Multi-Finding AST Patch Synthesis",
    "formula": "\\text{Patch}_{\\text{unificado}} = \\bigoplus_{k=1}^m \\text{ASTTransform}(F_k)",
    "desc": "Combina parches atómicos de múltiples analizadores en una única transformación sintáctica coherente, evitando colisiones de edición y garantizando que el archivo final compile limpiamente.",
    "metrics": {
      "Salida": "Diff Unificado",
      "Latencia": "< 11ms",
      "Resolución": "Sin Conflictos",
      "Garantía": "AST Sintácticamente Válido"
    },
    "radarSector": "semantics"
  },
  "KG": {
    "name": "knowledge_graph.py: SQLite WAL 3404 LOC",
    "layer": "CAPA 07 // GRAPHRAG & MEMORIA MERKLE",
    "file": "core/memory/knowledge_graph.py",
    "algo": "In-Process Property Graph Database & Gremlin Engine",
    "formula": "G = (V_{\\text{symbols}}, E_{\\text{deps}}) \\quad [\\text{SQLite WAL Pragma zero-copy}]",
    "desc": "Grafo de conocimiento local de 3,404 líneas en SQLite con modo WAL y motor de consultas estilo Gremlin. Almacena símbolos, relaciones de herencia, llamadas y metadatos de Git.",
    "metrics": {
      "Líneas Código": "3,404 LOC",
      "Latencia Consulta": "< 1.4ms",
      "Concurrencia": "Multi-lector WAL",
      "Garantía": "Transacciones ACID"
    },
    "radarSector": "semantics"
  },
  "MERKLE": {
    "name": "hashing.py: Árboles Merkle α-equiv",
    "layer": "CAPA 07 // GRAPHRAG & MEMORIA MERKLE",
    "file": "core/memory/hashing.py",
    "algo": "Alpha-Equivalence Semantic Merkle Trees",
    "formula": "H_{\\text{node}} = \\text{BLAKE3}\\left(\\text{Type} \\,\\|\\, \\text{NormalizedChildren}\\right)",
    "desc": "Genera hashes semánticos Merkle inmunes a renombramientos cosméticos de variables o cambios de espacios en blanco. Si el hash no cambia, el subsistema entero omite el reanálisis.",
    "metrics": {
      "Hash": "BLAKE3 Cripto",
      "Latencia": "< 2.8ms",
      "Inmunidad": "Espacios y Renombres",
      "Garantía": "Determinismo Puro"
    },
    "radarSector": "semantics"
  },
  "NODE2VEC": {
    "name": "topology.py: Node2Vec SGNS NumPy",
    "layer": "CAPA 07 // GRAPHRAG & MEMORIA MERKLE",
    "file": "core/memory/graph_rag/topology.py",
    "algo": "Pure NumPy Node2Vec Random Walks & SGNS Embeddings",
    "formula": "\\pi_{vx} = \\alpha_{pq}(t, x) \\cdot w_{vx} \\quad \\text{sin PyTorch ni librerías pesadas}",
    "desc": "Implementación artesanal de caminatas aleatorias de segundo orden y skip-gram con muestreo negativo escrita puramente en NumPy. Genera embeddings topológicos de código ultraligeros.",
    "metrics": {
      "Dependencias": "Solo NumPy",
      "Latencia": "< 55ms",
      "Dimensiones": "64D - 128D",
      "Garantía": "Portabilidad Total"
    },
    "radarSector": "physics"
  },
  "LEIDEN": {
    "name": "community.py: Comunidades Leiden",
    "layer": "CAPA 07 // GRAPHRAG & MEMORIA MERKLE",
    "file": "core/memory/graph_rag/community.py",
    "algo": "Leiden & Louvain Hierarchical Modularity Chunking",
    "formula": "\\mathcal{H} = \\frac{1}{2m} \\sum_{ij} \\left[ A_{ij} - \\gamma \\frac{k_i k_j}{2m} \\right] \\delta(\\sigma_i, \\sigma_j)",
    "desc": "Agrupa clases y funciones en comunidades densamente conectadas mediante el algoritmo Leiden. Produce macro-chunks semánticos coherentes para alimentar el contexto de los agentes de IA.",
    "metrics": {
      "Modularidad": "Resolución γ Ajustable",
      "Latencia": "< 22ms",
      "Calidad": "Comunidades Conexas",
      "Garantía": "Sin Particiones Desconexas"
    },
    "radarSector": "cybernetics"
  },
  "STEINER": {
    "name": "explainability.py: Árbol Steiner",
    "layer": "CAPA 07 // GRAPHRAG & MEMORIA MERKLE",
    "file": "core/memory/explainability.py",
    "algo": "Minimum Steiner Tree & MMR Contrastive Routing",
    "formula": "T_{\\text{Steiner}} = \\arg\\min_T \\sum_{e \\in T} w(e) \\quad \\text{conectando hallazgo con causa}",
    "desc": "Traza la ruta más corta y explicable entre un hallazgo y sus dependencias causales en el grafo de conocimiento, eliminando caminos redundantes con exclusión contrastiva MMR.",
    "metrics": {
      "Complejidad": "O(Terminals · E)",
      "Latencia": "< 12ms",
      "Explicabilidad": "Ruta Causal Mínima",
      "Garantía": "Máxima Relevancia"
    },
    "radarSector": "semantics"
  },
  "TRIAD": {
    "name": "Tríada Dialéctica: Purista vs Hacker vs Sintetizador",
    "layer": "CAPA 08 // COLISEO COGNITIVO & FORENSE MULTI-AGENTE",
    "file": "core/engine/chat_debate.py",
    "algo": "Multi-Agent Hegelian Dialectical Debate Engine",
    "formula": "\\text{Tesis}_{\\text{Hacker}} \\oplus \\text{Antítesis}_{\\text{Purista}} \\xrightarrow{\\text{Sintetizador}} \\text{Solución Óptima}",
    "desc": "Tres agentes de IA con personalidades cognitivas opuestas debaten cada diagnóstico: el Purista defiende tipado y modularidad estricta, el Hacker busca mínima latencia y el Sintetizador armoniza.",
    "metrics": {
      "Agentes": "3 Roles Dialécticos",
      "Modo": "Debate Asíncrono",
      "Consenso": "Arbitraje Matemático",
      "Garantía": "Sin Alucinación Unilateral"
    },
    "radarSector": "cybernetics"
  },
  "SWARM": {
    "name": "Enjambre 4 Auditores",
    "layer": "CAPA 08 // COLISEO COGNITIVO & FORENSE MULTI-AGENTE",
    "file": "core/engine/chat_debate.py",
    "algo": "Parallel Multi-Persona Specialized Verification Swarm",
    "formula": "\\text{Aprobación} = \\bigwedge_{j=1}^4 \\left( \\text{Veto}_j = \\text{False} \\right)",
    "desc": "Cuatro centinelas especializados: Auditor de Ashby (variedad cibernética), Chandrasekhar (límite de masa crítica), Lorentz (leyes físicas) y Seguridad (vulnerabilidades y permisos).",
    "metrics": {
      "Auditores": "4 Especialistas",
      "Latencia": "< 90ms",
      "Veto": "Poder de Bloqueo",
      "Garantía": "Supervisión Cuádruple"
    },
    "radarSector": "cybernetics"
  },
  "ORB": {
    "name": "El Orbe: Streaming Ghost /ollama",
    "layer": "CAPA 08 // COLISEO COGNITIVO & FORENSE MULTI-AGENTE",
    "file": "core/engine/chat_ghost_mode.py",
    "algo": "Real-Time Server-Sent Events (SSE) Streamer",
    "formula": "\\text{SSE}(\\text{Token}_k) \\xrightarrow{\\Delta t < 20\\text{ms}} \\text{HUD Cockpit}",
    "desc": "Conexión ultrarrápida que transmite el pensamiento en tiempo real de modelos de lenguaje locales (Ollama/Llama-3/Mistral/Qwen) hacia la interfaz táctica sin almacenamiento intermedio.",
    "metrics": {
      "Protocolo": "Server-Sent Events",
      "Latencia TTFT": "< 20ms",
      "Soporte": "Modelos Locales",
      "Garantía": "Streaming Continuo"
    },
    "radarSector": "cybernetics"
  },
  "TIME": {
    "name": "Máquina del Tiempo: Commits AST",
    "layer": "CAPA 08 // COLISEO COGNITIVO & FORENSE MULTI-AGENTE",
    "file": "core/engine/chat_timelapse.py",
    "algo": "Historical AST Differential Replay & Slider",
    "formula": "\\text{AST}(t) \\xrightarrow{\\Delta \\text{commit}} \\text{AST}(t + \\delta)",
    "desc": "Permite deslizar el cursor temporal del proyecto a través de cualquier punto de la historia de Git, reconstruyendo el estado del AST y las métricas de estrés para ubicar la introducción de un bug.",
    "metrics": {
      "Alcance": "Todo el Historial Git",
      "Latencia": "< 15ms",
      "Precisión": "Por Commit/Línea",
      "Garantía": "Historial Inmutable"
    },
    "radarSector": "semantics"
  },
  "AUTOPSY": {
    "name": "El Forense: PromptDNA & Causal",
    "layer": "CAPA 08 // COLISEO COGNITIVO & FORENSE MULTI-AGENTE",
    "file": "core/engine/chat_autopsy.py",
    "algo": "Causal Graph Regression Analysis & PromptDNA Antibodies",
    "formula": "\\text{PromptDNA} = \\text{ReglasBase} \\cup \\text{Anticuerpo}(\\text{ErroresPasados})",
    "desc": "Al ocurrir una regresión o fallo, el Forense desglosa la causa raíz y codifica un anticuerpo en PromptDNA para que ningún agente de IA del sistema vuelva a cometer ese mismo error.",
    "metrics": {
      "Memoria": "Epigenética de Código",
      "Latencia": "< 25ms",
      "Evolución": "Inmunidad Progresiva",
      "Garantía": "Cero Reincidencia"
    },
    "radarSector": "cybernetics"
  },
  "FASTAPI": {
    "name": "FastAPI: Servidor Asíncrono WebSockets & SSE",
    "layer": "CAPA 09 // CAPA DE SERVICIO API, PROTOCOLO MCP & CI/CD",
    "file": "core/api/main.py",
    "algo": "ASGI High-Concurrency Real-Time Telemetry Server",
    "formula": "\\text{Uvicorn ASGI} \\longleftrightarrow \\text{WebSockets} \\cup \\text{SSE} \\cup \\text{REST JSON}",
    "desc": "Capa de servicio asíncrona de alta concurrencia. Expone endpoints de telemetría de estrés, streaming de debates y mutaciones de código hacia el cockpit, clientes CLI y agentes externos.",
    "metrics": {
      "Conexiones": "> 10,000 Concurrentes",
      "Latencia": "< 1.5ms",
      "Protocolo": "HTTP/2 + WS",
      "Garantía": "Asincronía Total"
    },
    "radarSector": "cybernetics"
  },
  "MCP": {
    "name": "mcp_server: Servidor JSON-RPC 2.0",
    "layer": "CAPA 09 // CAPA DE SERVICIO API, PROTOCOLO MCP & CI/CD",
    "file": "core/api/mcp_server.py",
    "algo": "Model Context Protocol (MCP) Standard Server",
    "formula": "\\text{Tools}(\\text{Archangel}) \\xrightarrow{\\text{MCP}} \\text{Claude Desktop, Cursor, Gemini, AGY}",
    "desc": "Servidor oficial del protocolo MCP de Anthropic. Expone las capacidades de inspección de AST, cálculo de estrés y reparación de Archangel como herramientas ejecutables por LLMs externos.",
    "metrics": {
      "Estándar": "MCP JSON-RPC 2.0",
      "Herramientas": "24 Tools Expuestas",
      "Transporte": "Stdio & SSE",
      "Garantía": "Interoperabilidad"
    },
    "radarSector": "cybernetics"
  },
  "CLIENTS": {
    "name": "Clientes: Cockpit, VSCode & GitHub CI/CD",
    "layer": "CAPA 09 // CAPA DE SERVICIO API, PROTOCOLO MCP & CI/CD",
    "file": "archangel-v7 / archangel-vscode / archangel-action",
    "algo": "Multi-Surface Ecosystem (Vite React + LSP IDE + SARIF 2.1.0)",
    "formula": "\\text{SARIF 2.1.0} \\to \\text{GitHub PR Blocking} \\quad \\text{y} \\quad \\text{React 60FPS Cockpit}",
    "desc": "Ecosistema de interfaces de usuario: archangel-v7 (cockpit en React y Vite), archangel-vscode (extensión IDE con Language Server Protocol) y archangel-action (bloqueo en CI/CD con SARIF).",
    "metrics": {
      "Superficies": "Web, IDE, CI/CD",
      "Rendimiento": "60 FPS",
      "Estándar": "SARIF 2.1.0",
      "Garantía": "Cumplimiento Normativo"
    },
    "radarSector": "cybernetics"
  },
  "COOP": {
    "name": "cooperative.py: Tokens de Cancelación Cooperativa",
    "layer": "CAPA 02 // ORQUESTADOR DAG BIFÁSICO & AFR",
    "file": "core/analyzers/registry/cooperative.py",
    "algo": "Cooperative Multitasking & Cancellation Tokens",
    "formula": "\\text{Token.is\\_cancelled}() \\implies \\text{GracefulShedding}(\\text{WorkerThread})",
    "desc": "Proporciona puntos de suspensión y cancelación cooperativa en bucles internos de analizadores pesados. Permite cancelar análisis obsoletos instantáneamente cuando se detecta un nuevo commit en el repositorio.",
    "metrics": {
      "Complejidad": "O(1) Atomic Check",
      "Latencia": "< 5µs",
      "Overhead": "Inapreciable",
      "Garantía": "Sin Corrupción de Estado"
    },
    "radarSector": "cybernetics"
  },
  "C00": {
    "name": "CAPA 00: Sustrato Nativo Rust Zero-GIL (31,666 LOC)",
    "layer": "CAPA 00 // NATIVO RUST ZERO-GIL",
    "file": "archangel_rs/src/",
    "algo": "Runtime Nativo Multi-VM & Memoria Compartida POSIX",
    "formula": "T_{\\text{exec}} \\le 1.2\\text{ms} \\quad \\text{con } \\text{GIL} = \\emptyset, \\quad \\text{LOC} = 31,666",
    "desc": "Cimiento monolítico en Rust compilado con AVX2/LTO. Contiene los motores nativos evm.rs, wasm.rs, race_pts.rs (puntos-a de Andersen) y deadlock_cfg.rs (Tarjan O(V+E)), comunicados con el orquestador Python vía POSIX /dev/shm.",
    "metrics": {
      "Código Nativo": "31,666 LOC",
      "Latencia": "< 2ms",
      "Overhead": "Zero-GIL",
      "Garantía": "Memory Safety Criptográfico"
    },
    "radarSector": "rust"
  },
  "C01": {
    "name": "CAPA 01: Ingestión Políglota & Universal IR",
    "layer": "CAPA 01 // INGESTIÓN POLÍGLOTA & UNIVERSAL IR",
    "file": "core/ir/ & core/parsers/",
    "algo": "Inception Parser, Universal IR & MCKP Knapsack Solver",
    "formula": "\\max \\sum v_{ij} x_{ij} \\le B_{\\text{tokens}} \\quad \\text{y} \\quad \\mathcal{G}_{\\text{inception}}",
    "desc": "Ingesta multi-lenguaje de 15 gramáticas, descompresión de lenguajes anidados en strings con Inception Parser (SQL/Regex/GraphQL), poda óptima de contexto mediante MCKP y slicing quirúrgico hacia atrás en el PDG.",
    "metrics": {
      "Lenguajes": "15 Gramáticas",
      "Poda": "MCKP Óptimo",
      "Slicing": "Backward PDG",
      "Garantía": "Universal IR Unificado"
    },
    "radarSector": "semantics"
  },
  "C02": {
    "name": "CAPA 02: Orquestador DAG Bifásico & AFR",
    "layer": "CAPA 02 // ORQUESTADOR DAG BIFÁSICO & AFR",
    "file": "core/analyzers/registry/",
    "algo": "Topological Wave Scheduling & Cryptographic Flight Recorder",
    "formula": "H_k = \\text{SHA256}(H_{k-1} \\,\\|\\, E_k), \\quad \\text{Wave}_0 \\to \\text{Wave}_1",
    "desc": "Planificador de ondas topológicas acíclicas. Coordina el despacho concurrente de los 76 analizadores, administra budgets de fallo mediante Circuit Breakers en health.py y registra una auditoría criptográfica inmutable en flight_recorder.py.",
    "metrics": {
      "Olas": "Bifásico Wave 0 / 1",
      "Auditoría": "SHA-256 AFR",
      "Circuit Breakers": "health.py Leaky Bucket",
      "Garantía": "Deadlock-Free"
    },
    "radarSector": "cybernetics"
  },
  "C03": {
    "name": "CAPA 03: Ola 0 - 76 Analizadores Paralelos (6 Familias)",
    "layer": "CAPA 03 // OLA 0: 76 ANALIZADORES PARALELOS",
    "file": "core/analyzers/{physics,rules,semantics,topology,metrics,ir}/",
    "algo": "Massive Parallel Analyzer Wave across 6 Scientific Domains",
    "formula": "76 \\times \\text{Analyzers: Física (16), Reglas (12), Semántica (14), Topología (14), Métricas (10), IR (10)}",
    "desc": "La mayor batería de analizadores estáticos científicos jamás construida en un linter: dualidad AdS/CFT, recocido SQA Trotter P=8, ciclo adaptativo de Panaquía, variedad de Ashby, 6 costuras Feathers, chaperón molecular GroEL/GroES, entropía bigrama y fatiga Wöhler.",
    "metrics": {
      "Analizadores": "76 Paralelos",
      "Familias": "6 Dominios",
      "Despacho": "Multiprocess Pool",
      "Garantía": "Cobertura Total"
    },
    "radarSector": "physics"
  },
  "C04": {
    "name": "CAPA 04: Ola 1 - Analizadores de Segundo Orden",
    "layer": "CAPA 04 // OLA 1: ANALIZADORES DEPENDIENTES",
    "file": "core/analyzers/metrics/conway_analyzer.py & topology/dangerous_flows.py",
    "algo": "Cross-Domain Topological Synthesis & Inter-Procedural Taint",
    "formula": "\\text{Mismatch} = \\| G_{\\text{code}} - G_{\\text{human}} \\|_{\\text{Frobenius}} \\quad \\text{y} \\quad \\text{TaintCruzado}",
    "desc": "Consume las señales acumuladas en el buffer de memoria compartida POSIX de la Ola 0. Modela la Ley de Conway cruzando el grafo humano de Git con los módulos del código y rastrea taint entre funciones y paquetes.",
    "metrics": {
      "Dependencia": "Ola 0 Signals",
      "Buffer": "/dev/shm Ring",
      "Análisis": "Topológico Cruzado",
      "Garantía": "Ley de Conway Formal"
    },
    "radarSector": "cybernetics"
  },
  "C05": {
    "name": "CAPA 05: Tensor de Estrés Dinámico S & Sistema Nervioso (ANS)",
    "layer": "CAPA 05 // TENSOR DE ESTRÉS S & SISTEMA NERVIOSO (ANS)",
    "file": "core/engine/unified_risk.py & core/actions/autonomic_nervous_system/",
    "algo": "7D Stress Tensor, Software Stability Index & Sympathetic/Parasympathetic Reflexes",
    "formula": "\\mathcal{S} \\in \\mathbb{R}^{7 \\times 7}, \\quad SSI = 100 \\cdot (1 - \\Phi), \\quad t_{\\text{simpático}} < 50\\text{ms}",
    "desc": "El corazón bio-cibernético de Archangel. Modela el estado global de salud del software en un tensor de 7 dimensiones y 13 escalares. Dispara el ANS Simpático para bloqueos ultrarrápidos (<50ms) y el Parasimpático con mutación clonal CLONALG y MCTS para auto-cicatrización.",
    "metrics": {
      "Dimensiones": "7D x 13 Escalares",
      "Índice Salud": "SSI (0-100)",
      "Reflejo Rápido": "< 50ms",
      "Garantía": "Homeostasis Autónoma"
    },
    "radarSector": "physics"
  },
  "C06": {
    "name": "CAPA 06: Correlador Bayesiano V3 & Síntesis Unificada",
    "layer": "CAPA 06 // CORRELADOR BAYESIANO V3 & SÍNTESIS",
    "file": "core/analyzers/correlator/",
    "algo": "Boolean Lattice Bellman DP, Shapley Values & Concurrency Ladder",
    "formula": "V(S) = \\min_{a} \\left[ c(S,a) + \\sum P(S\\'|S,a) V(S\\') \\right], \\quad \\phi_i(v) \\text{ Shapley}",
    "desc": "Motor de fusión probabilística que suprime el 80% del ruido redundante (collapse.py), calcula la atribución justa de cada analizador mediante teoría de juegos cooperativos (Shapley), verifica carreras con una escalera probatoria de 3 peldaños y sintetiza parches AST unificados.",
    "metrics": {
      "Supresión Ruido": "-80% Fatiga",
      "Atribución": "Valores Shapley",
      "Verificación": "Escalera 3 Peldaños",
      "Garantía": "Sin Falsos Positivos"
    },
    "radarSector": "cybernetics"
  },
  "C07": {
    "name": "CAPA 07: GraphRAG & Memoria Semántica Merkle",
    "layer": "CAPA 07 // GRAPHRAG & MEMORIA MERKLE",
    "file": "core/memory/knowledge_graph.py & graph_rag/",
    "algo": "SQLite WAL Graph DB (3404 LOC), Alpha-Merkle Hashing, Node2Vec SGNS, Leiden",
    "formula": "G = (V, E), \\quad H = \\text{BLAKE3}(\\alpha\\text{-equiv}), \\quad \\mathcal{H}_{\\text{Leiden}} = \\text{MacroChunks}",
    "desc": "Palacio de memoria persistente en SQLite WAL con 3,404 líneas de motor de grafos. Integra árboles Merkle alfa-equivalentes inmunes a formateos, embeddings topológicos Node2Vec en NumPy puro y macro-chunking por modularidad Leiden para RAG de alta precisión.",
    "metrics": {
      "Base de Datos": "SQLite WAL 3,404 LOC",
      "Hashes": "BLAKE3 Alpha-Equiv",
      "Embeddings": "Node2Vec SGNS",
      "Garantía": "Persistencia ACID"
    },
    "radarSector": "semantics"
  },
  "C08": {
    "name": "CAPA 08: Coliseo Cognitivo & Forense Multi-Agente",
    "layer": "CAPA 08 // COLISEO COGNITIVO & FORENSE MULTI-AGENTE",
    "file": "core/engine/chat_debate.py, chat_ghost_mode.py & chat_autopsy.py",
    "algo": "Hegelian Dialectical Triad, 4-Persona Auditor Swarm, Time Machine & PromptDNA",
    "formula": "\\text{Tesis}_{\\text{Hacker}} \\oplus \\text{Antítesis}_{\\text{Purista}} \\xrightarrow{\\text{Sintetizador}} \\text{Consenso}, \\quad \\text{PromptDNA}",
    "desc": "Ágora de arbitraje cognitivo donde tres agentes de IA (Purista, Hacker y Sintetizador) debaten parches arquitectónicos bajo la supervisión de un enjambre de 4 auditores con poder de veto. Incluye el streaming SSE de El Orbe, la Máquina del Tiempo de Git y memoria epigenética en PromptDNA.",
    "metrics": {
      "Debate": "Tríada Dialéctica",
      "Supervisión": "Enjambre 4 Auditores",
      "Streaming": "SSE El Orbe < 20ms",
      "Garantía": "Inmunidad Epigenética"
    },
    "radarSector": "cybernetics"
  },
  "C09": {
    "name": "CAPA 09: Capa de Servicio API, Protocolo MCP & CI/CD",
    "layer": "CAPA 09 // CAPA DE SERVICIO API, PROTOCOLO MCP & CI/CD",
    "file": "core/api/main.py, mcp_server.py & archangel-action",
    "algo": "FastAPI ASGI WebSockets/SSE, Model Context Protocol & SARIF PR Gates",
    "formula": "\\text{Tools}(\\text{Archangel}) \\xrightarrow{\\text{MCP}} \\text{Claude/Cursor/Gemini}, \\quad \\text{SARIF 2.1.0 Gate}",
    "desc": "Frontera de comunicación con el mundo exterior. Servidor asíncrono FastAPI con WebSockets y SSE, servidor oficial MCP (Model Context Protocol JSON-RPC 2.0) para conectar con Claude Desktop, Cursor y Gemini, extensión para VSCode y Action de GitHub con bloqueo estricto en SARIF 2.1.0.",
    "metrics": {
      "Concurrencia": "> 10,000 WS/SSE",
      "Protocolo": "MCP JSON-RPC 2.0",
      "Integración": "GitHub SARIF Gate",
      "Garantía": "Ecosistema Unificado"
    },
    "radarSector": "cybernetics"
  }
};

    // Referencias a los elementos del HUD Táctico
    const hudDrawer = document.getElementById('diagramHudDrawer');
    const hudLayerChip = document.getElementById('hudLayerChip');
    const hudNodeTitle = document.getElementById('hudNodeTitle');
    const hudDrawerBody = document.getElementById('hudDrawerBody');
    const btnHudClose = document.getElementById('btnHudClose');

    const searchInput = document.getElementById('diagramSearchInput');
    const searchClear = document.getElementById('diagramSearchClear');

    const simSelect = document.getElementById('simIncidentSelect');
    const btnRunSim = document.getElementById('btnRunIncident');
    const simTickerText = document.getElementById('simTickerText');

    const minimapCanvas = document.getElementById('minimapCanvas');
    const minimapVpBox = document.getElementById('minimapVpBox');
    const minimapContainer = document.getElementById('diagramMinimap');

    // ──────────────────────────────────────────────────────────────────────
    // 1. HUD INSPECTOR DRAWER (PROFUNDIDAD FORENSE SIN RESÚMENES)
    // ──────────────────────────────────────────────────────────────────────
    function openNodeInspector(data, nodeEl) {
      if (!hudDrawer || !data) return;

      if (hudLayerChip) hudLayerChip.textContent = data.layer || 'COMPONENTE // ARCHANGEL Ω';
      if (hudNodeTitle) hudNodeTitle.textContent = data.name || 'Módulo Arquitectónico';

      let metricsHtml = '';
      if (data.metrics) {
        metricsHtml = Object.entries(data.metrics).map(([k, v]) => `
          <div class="hud-metric-pill">
            <span class="lbl">${k}</span>
            <span class="val">${v}</span>
          </div>
        `).join('');
      }

      hudDrawerBody.innerHTML = `
        <div class="hud-card">
          <div class="hud-card-label">Ruta del Archivo Fuente</div>
          <div class="hud-file-path">${data.file || 'core/engine/'}</div>
        </div>

        <div class="hud-card">
          <div class="hud-card-label">Clase Algorítmica &amp; Garantía</div>
          <div style="font-size:0.82rem; color:#fff; font-weight:600;">${data.algo || 'Algoritmo Determinista'}</div>
        </div>

        ${data.formula ? `
        <div class="hud-card">
          <div class="hud-card-label">Formulación Matemática Exacta</div>
          <div class="hud-math-box">$$${data.formula}$$</div>
        </div>
        ` : ''}

        <div class="hud-card">
          <div class="hud-card-label">Métricas Operacionales &amp; Rendimiento</div>
          <div class="hud-metrics-grid">${metricsHtml}</div>
        </div>

        <div class="hud-card">
          <div class="hud-card-label">Mecánica Operativa &amp; Arquitectura</div>
          <p style="font-size:0.8rem; line-height:1.6; color:#c5dcfa; margin:0;">${data.desc || ''}</p>
        </div>

        <button class="hud-action-btn" id="btnFocusInRadar">
          <span>🎯 Sincronizar con Reactor Radar 3D</span>
        </button>
      `;

      // Renderizar fórmulas con KaTeX
      if (window.renderMathInElement) {
        window.renderMathInElement(hudDrawerBody, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ]
        });
      }

      // Conectar botón de radar
      const btnFocusRadar = document.getElementById('btnFocusInRadar');
      if (btnFocusRadar && data.radarSector) {
        btnFocusRadar.addEventListener('click', () => {
          selectSector(data.radarSector);
          const radarSec = document.querySelector('.quantum-radar-hud');
          if (radarSec) radarSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }

      // Abrir drawer
      hudDrawer.classList.add('is-open');

      // Resaltar nodo en SVG
      const allNodes = diagStage.querySelectorAll('svg .node');
      allNodes.forEach(n => n.classList.remove('is-selected'));
      if (nodeEl) nodeEl.classList.add('is-selected');

      // Log en ticker
      if (simTickerText) {
        simTickerText.textContent = `INSPECTOR ACTIVO // [${data.name}] // ARCHIVO: ${data.file}`;
      }
    }

    function closeNodeInspector() {
      if (hudDrawer) hudDrawer.classList.remove('is-open');
      const allNodes = diagStage.querySelectorAll('svg .node');
      allNodes.forEach(n => n.classList.remove('is-selected'));
      if (simTickerText) {
        simTickerText.textContent = `SISTEMA NOMINAL // 76 ANALIZADORES EN LÍNEA // HAZ CLIC EN CUALQUIER NODO PARA INSPECCIÓN FORENSE`;
      }
    }

    if (btnHudClose) {
      btnHudClose.addEventListener('click', closeNodeInspector);
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hudDrawer && hudDrawer.classList.contains('is-open')) {
        closeNodeInspector();
      }
    });

    // ──────────────────────────────────────────────────────────────────────
    // 2. CONEXIÓN DE CLICS & HOVER SOBRE NODOS SVG
    // ──────────────────────────────────────────────────────────────────────
    function focusElementInDiagram(el, customScale) {
      if (!el || !diagStage || !diagViewport) return;
      const bbox = el.getBBox();
      const vW = diagViewport.clientWidth || 1100;
      const vH = diagViewport.clientHeight || 740;
      if (customScale) {
        scale = customScale;
      } else if (bbox.height > 600) {
        scale = Math.min(Math.max((vH - 80) / bbox.height, 0.45), 0.75);
      } else {
        scale = Math.max(scale, 0.85);
      }
      panX = Math.round((vW / 2) - ((bbox.x + bbox.width / 2) * scale));
      panY = Math.round((vH / 2) - ((bbox.y + bbox.height / 2) * scale));
      updateTransform();
    }

    function findNodeData(nodeEl) {
      const textContent = nodeEl.textContent.trim();
      const nodeId = nodeEl.id || '';

      // Si es un cluster (subgrafo completo)
      if (nodeEl.classList.contains('cluster')) {
        for (const [key, data] of Object.entries(NODES_BLUEPRINT_REGISTRY)) {
          if (key.startsWith('C0') && nodeId.includes(key)) return data;
          if (key.startsWith('C0') && textContent.includes(key.substring(1))) return data;
        }
        if (textContent.includes('TENSOR DE ESTR')) return NODES_BLUEPRINT_REGISTRY['C05'];
        if (textContent.includes('CORRELADOR')) return NODES_BLUEPRINT_REGISTRY['C06'];
        if (textContent.includes('COLISEO')) return NODES_BLUEPRINT_REGISTRY['C08'];
        if (textContent.includes('GRAPHRAG')) return NODES_BLUEPRINT_REGISTRY['C07'];
        if (textContent.includes('76 ANALIZADORES')) return NODES_BLUEPRINT_REGISTRY['C03'];
        if (textContent.includes('RUST ZERO-GIL')) return NODES_BLUEPRINT_REGISTRY['C00'];
        if (textContent.includes('INGESTI')) return NODES_BLUEPRINT_REGISTRY['C01'];
        if (textContent.includes('ORQUESTADOR DAG')) return NODES_BLUEPRINT_REGISTRY['C02'];
        if (textContent.includes('OLA 1')) return NODES_BLUEPRINT_REGISTRY['C04'];
        if (textContent.includes('SERVICIO API')) return NODES_BLUEPRINT_REGISTRY['C09'];
        if (textContent.includes('Física, Reglas') || nodeId.includes('F_ROW1')) return NODES_BLUEPRINT_REGISTRY['F_ROW1'];
        if (textContent.includes('Topología, Métricas') || nodeId.includes('F_ROW2')) return NODES_BLUEPRINT_REGISTRY['F_ROW2'];
      }

      // Búsqueda por key en ID del nodo
      for (const [key, data] of Object.entries(NODES_BLUEPRINT_REGISTRY)) {
        if (nodeId.includes(key)) return data;
      }

      // Búsqueda por match en texto
      for (const [key, data] of Object.entries(NODES_BLUEPRINT_REGISTRY)) {
        const keyTerms = key.split('_');
        if (keyTerms.some(term => term.length > 2 && textContent.includes(term))) {
          return data;
        }
        if (data.name && textContent.includes(data.name.substring(0, 15))) {
          return data;
        }
      }

      return null;
    }

    function initNodeInteractivity() {
      const svgNodes = Array.from(diagStage.querySelectorAll('svg .node, svg .cluster'));
      if (!svgNodes.length) return;

      svgNodes.forEach(nodeEl => {
        const data = findNodeData(nodeEl);
        if (data) {
          nodeEl.style.cursor = 'pointer';
          nodeEl.setAttribute('data-blueprint-key', data.name);
          nodeEl.setAttribute('title', `${data.name} (Haz clic para inspección profunda)`);

          nodeEl.addEventListener('click', (e) => {
            e.stopPropagation();
            openNodeInspector(data, nodeEl);
            focusElementInDiagram(nodeEl);
          });

          nodeEl.addEventListener('mouseenter', () => {
            svgNodes.forEach(other => {
              if (other !== nodeEl) other.classList.add('dimmed');
            });
          });

          nodeEl.addEventListener('mouseleave', () => {
            svgNodes.forEach(other => other.classList.remove('dimmed'));
          });
        }
      });
    }

    // ──────────────────────────────────────────────────────────────────────
    // 3. MINI-MAPA TÁCTICO HOLOGRÁFICO (RADAR DE NAVEGACIÓN)
    // ──────────────────────────────────────────────────────────────────────
    function updateMinimap() {
      if (!minimapCanvas || !minimapVpBox) return;
      const svg = diagStage.querySelector('svg');
      if (!svg) return;

      const bbox = svg.getBBox ? svg.getBBox() : { width: 1960, height: 3900 };
      const svgW = bbox.width || 1960;
      const svgH = bbox.height || 3900;

      const vW = diagViewport.clientWidth || 1100;
      const vH = diagViewport.clientHeight || 740;

      const cW = minimapCanvas.width;
      const cH = minimapCanvas.height;

      // Calcular caja de visión en coordenadas de minimapa
      const scaleCanvasY = cH / (svgH * scale);
      const boxTop = Math.max(0, Math.min(cH - 20, (-panY * scaleCanvasY) + 20));
      const boxHeight = Math.max(15, Math.min(cH, vH * scaleCanvasY));

      minimapVpBox.style.top = `${boxTop}px`;
      minimapVpBox.style.height = `${boxHeight}px`;
    }

    function renderMinimapSilhouette() {
      if (!minimapCanvas) return;
      const ctx = minimapCanvas.getContext('2d');
      if (!ctx) return;

      const w = minimapCanvas.width;
      const h = minimapCanvas.height;

      ctx.fillStyle = '#02050c';
      ctx.fillRect(0, 0, w, h);

      // Rejilla técnica sutil
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Siluetas de los 10 bloques arquitectónicos
      const layerColors = [
        '#00ff88', // 00 Rust
        '#00f0ff', // 01 Ingesta
        '#ffaa00', // 02 DAG
        '#3ddad7', // 03 76 Analyzers
        '#ffaa00', // 04 Wave 1
        '#b845ff', // 05 Tensor
        '#ffc83b', // 06 Correlator
        '#00e5ff', // 07 GraphRAG
        '#ff3366', // 08 Colosseum
        '#60a5fa'  // 09 API/MCP
      ];

      const blockHeight = (h - 20) / 10;
      layerColors.forEach((col, idx) => {
        const by = 8 + idx * blockHeight;
        ctx.fillStyle = col + '22';
        ctx.strokeStyle = col + 'aa';
        ctx.lineWidth = 1;
        ctx.fillRect(12, by, w - 24, blockHeight - 4);
        ctx.strokeRect(12, by, w - 24, blockHeight - 4);
      });
    }

    if (minimapContainer) {
      minimapContainer.addEventListener('click', (e) => {
        const rect = minimapContainer.getBoundingClientRect();
        const clickY = e.clientY - rect.top - 20; // descartar header
        const fraction = Math.max(0, Math.min(1, clickY / 198));

        const svg = diagStage.querySelector('svg');
        const svgH = svg ? (svg.getBBox().height || 3900) : 3900;
        const vH = diagViewport.clientHeight || 740;

        panY = Math.round(-fraction * (svgH * scale) + (vH * 0.3));
        updateTransform();
      });
    }

    // ──────────────────────────────────────────────────────────────────────
    // 4. BUSCADOR TÁCTICO INSTANTÁNEO CON AUTO-ZOOM & PULSO
    // ──────────────────────────────────────────────────────────────────────
    function initSearch() {
      if (!searchInput) return;

      const performSearch = () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
          if (searchClear) searchClear.style.display = 'none';
          return;
        }
        if (searchClear) searchClear.style.display = 'block';

        // Buscar coincidencia en el registro
        let foundKey = null;
        let foundData = null;

        for (const [key, data] of Object.entries(NODES_BLUEPRINT_REGISTRY)) {
          if (
            key.toLowerCase().includes(query) ||
            data.name.toLowerCase().includes(query) ||
            (data.file && data.file.toLowerCase().includes(query)) ||
            (data.algo && data.algo.toLowerCase().includes(query))
          ) {
            foundKey = key;
            foundData = data;
            break;
          }
        }

        if (!foundKey) {
          if (simTickerText) simTickerText.textContent = `BUSCADOR // No se encontraron módulos coincidentes con "${query}"`;
          return;
        }

        // Ubicar elemento SVG
        const svgNodes = Array.from(diagStage.querySelectorAll('svg .node'));
        let targetNodeEl = null;

        for (const el of svgNodes) {
          if (el.id && el.id.includes(foundKey)) {
            targetNodeEl = el;
            break;
          }
        }
        if (!targetNodeEl) {
          for (const el of svgNodes) {
            if (el.textContent.includes(foundKey.replace('_', ''))) {
              targetNodeEl = el;
              break;
            }
          }
        }

        if (targetNodeEl) {
          const bbox = targetNodeEl.getBBox();
          const vW = diagViewport.clientWidth || 1100;
          const vH = diagViewport.clientHeight || 740;

          // Centrar cámara en el nodo
          scale = 0.95;
          panX = Math.round((vW / 2) - ((bbox.x + bbox.width / 2) * scale));
          panY = Math.round((vH / 2) - ((bbox.y + bbox.height / 2) * scale));
          updateTransform();

          // Activar pulso spotlight
          targetNodeEl.classList.remove('is-spotlight');
          void targetNodeEl.offsetWidth; // reflow
          targetNodeEl.classList.add('is-spotlight');

          // Abrir drawer
          openNodeInspector(foundData, targetNodeEl);

          if (simTickerText) {
            simTickerText.textContent = `BUSCADOR // Módulo localizado: [${foundData.name}] en ${foundData.layer}`;
          }
        }
      };

      searchInput.addEventListener('input', performSearch);
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') performSearch();
      });

      if (searchClear) {
        searchClear.addEventListener('click', () => {
          searchInput.value = '';
          searchClear.style.display = 'none';
          closeNodeInspector();
        });
      }
    }

    // ──────────────────────────────────────────────────────────────────────
    // 5. SIMULADOR DE INYECCIÓN DE FALLOS EN VIVO (CHAOS INJECTION)
    // ──────────────────────────────────────────────────────────────────────
    const INCIDENT_SCENARIOS = {
      reentrancy: [
        { key: 'RS_EVM', msg: '[T+1.2ms] evm.rs decodificó bytecode crudo: CALL externo no protegido antes de SSTORE (SWC-107 detectado)', panFraction: 0.05 },
        { key: 'RS_SHM', msg: '[T+3.4ms] Señal serializada en /dev/shm ring buffer hacia el planificador DAG en microsegundos', panFraction: 0.10 },
        { key: 'TENSOR', msg: '[T+6.8ms] StressTensor recalculado: S_concurrency escaló a 0.95. Traza Phi se disparó a 0.72. SSI cayó a 28.0/100', panFraction: 0.45 },
        { key: 'ANS_FAST', msg: '[T+11.5ms] ANS Simpático disparó compuerta reflectiva (<50ms): Transacción externa congelada preventivamente', panFraction: 0.50 },
        { key: 'CLONALG', msg: '[T+19.2ms] Mutación Clonal CLONALG sintetizó anticuerpo sintético con modificador nonReentrant', panFraction: 0.55 },
        { key: 'CLIENTS', msg: '[T+28.4ms] Alerta propagada a IDE VSCode y GitHub Action bloqueó PR con reporte SARIF 2.1.0 generado', panFraction: 0.95 }
      ],
      god_object: [
        { key: 'IN_SRC', msg: '[T+1.8ms] Workspace scanner detectó módulo hipertrófico core_service.py con 4,280 LOC y Fan-In de 48 dependientes', panFraction: 0.05 },
        { key: 'F_PHYS', msg: '[T+7.2ms] holographic_black_hole: Masa crítica excedió límite de Schwarzschild. Tasa de radiación Hawking predice 12 bugs', panFraction: 0.25 },
        { key: 'F_RULE', msg: '[T+14.0ms] rule_panarchy_adaptive_cycle: K_score = 0.96. Fase de Conservación al borde de colapso caótico Omega', panFraction: 0.28 },
        { key: 'F_SEM', msg: '[T+22.5ms] seam_discovery identificó 6 costuras Michael Feathers. code_folding_chaperone hidroliza 14 ATP para replegar', panFraction: 0.32 },
        { key: 'BELLMAN', msg: '[T+31.0ms] Retículo Booleano Bellman DP resolvió bisección LCOM4: 3 clases cohesivas desacopladas extraídas', panFraction: 0.60 },
        { key: 'FIX_SYNTH', msg: '[T+42.1ms] fix_synthesis generó parche AST unificado. Deuda técnica eliminada sin alterar contratos públicos', panFraction: 0.65 }
      ],
      race_shm: [
        { key: 'RS_PTS', msg: '[T+2.1ms] race_pts.rs (Andersen 1-Obj): Bitset FxHash detectó colisión de punteros mutables en hilo secundario', panFraction: 0.05 },
        { key: 'RS_DEAD', msg: '[T+5.9ms] deadlock_cfg.rs: Algoritmo Tarjan O(V+E) detectó ciclo potencial entre LockA -> LockB', panFraction: 0.08 },
        { key: 'RACE', msg: '[T+12.4ms] concurrency_evidence: Escalera de 3 peldaños confirmada (AST write + Points-To overlap + Interleaving)', panFraction: 0.62 },
        { key: 'ANS_COLD', msg: '[T+20.8ms] ANS Parasimpático generó worktree git temporal aislado y aplicó patrón Atomic Arc<RwLock>', panFraction: 0.52 },
        { key: 'AUTOPSY', msg: '[T+33.0ms] El Forense codificó anticuerpo de concurrencia en PromptDNA para prevenir regresiones futuras', panFraction: 0.85 }
      ],
      hallucination: [
        { key: 'TRIAD', msg: '[T+3.2ms] Agente Hacker propuso parche de optimización que elimina validación de tipos en runtime', panFraction: 0.80 },
        { key: 'F_PHYS', msg: '[T+9.4ms] synthetic_lorentz_filter: Demonio de Maxwell evaluó parche contra 8 leyes físicas. Violación de Ley de Hyrum', panFraction: 0.26 },
        { key: 'SWARM', msg: '[T+16.5ms] Enjambre de 4 auditores: Auditor de Lorentz y Auditor de Seguridad ejercieron veto absoluto simultáneo', panFraction: 0.82 },
        { key: 'AUTOPSY', msg: '[T+25.0ms] El Escéptico ejecutó replay contrafactual demostrando regresión. Alucinación neutralizada en 0 ciclos de CPU', panFraction: 0.85 }
      ]
    };

    let isIncidentRunning = false;

    function runIncidentSimulation() {
      if (isIncidentRunning || !simSelect) return;
      const scenarioKey = simSelect.value;
      if (!scenarioKey || !INCIDENT_SCENARIOS[scenarioKey]) {
        alert('Por favor selecciona un escenario de incidente válido en el selector.');
        return;
      }

      isIncidentRunning = true;
      if (btnRunSim) {
        btnRunSim.disabled = true;
        btnRunSim.textContent = '⚡ Simulando...';
      }

      const steps = INCIDENT_SCENARIOS[scenarioKey];
      const svgNodes = Array.from(diagStage.querySelectorAll('svg .node'));
      svgNodes.forEach(n => {
        n.classList.remove('is-incident-active');
        n.classList.remove('is-selected');
      });

      let stepIdx = 0;

      function executeNextStep() {
        if (stepIdx >= steps.length) {
          // Fin de la simulación
          setTimeout(() => {
            svgNodes.forEach(n => n.classList.remove('is-incident-active'));
            isIncidentRunning = false;
            if (btnRunSim) {
              btnRunSim.disabled = false;
              btnRunSim.textContent = '▶ Inyectar';
            }
            if (simTickerText) {
              simTickerText.textContent = `SIMULACIÓN COMPLETADA // Todos los subsistemas contuvieron el vector de riesgo y restauraron la estabilidad`;
            }
          }, 2500);
          return;
        }

        const step = steps[stepIdx];
        if (simTickerText) simTickerText.textContent = step.msg;

        // Desplazar cámara suavemente hacia el sector activo
        if (step.panFraction !== undefined) {
          const svg = diagStage.querySelector('svg');
          const svgH = svg ? (svg.getBBox().height || 3900) : 3900;
          const vH = diagViewport.clientHeight || 740;
          panY = Math.round(-step.panFraction * (svgH * scale) + (vH * 0.35));
          updateTransform();
        }

        // Iluminar nodo
        svgNodes.forEach(n => n.classList.remove('is-incident-active'));
        for (const el of svgNodes) {
          if (el.id && el.id.includes(step.key)) {
            el.classList.add('is-incident-active');
            break;
          }
        }

        stepIdx++;
        setTimeout(executeNextStep, 1400);
      }

      executeNextStep();
    }

    if (btnRunSim) {
      btnRunSim.addEventListener('click', runIncidentSimulation);
    }

    // Función global de navegación reactiva para botones de filtro y pasos macro
    window.focusLayerInDiagram = function(layerId) {
      const clusterMap = {
        'layer-0': 'C00',
        'layer-1': 'C01',
        'layer-2': 'C02',
        'layer-3': 'C03',
        'layer-4': 'C05', // Capa 04: Tensor S & ANS -> C05
        'layer-5': 'C06', // Capa 05: Correlador Bayesiano -> C06
        'layer-6': 'C07', // Capa 06: GraphRAG & Merkle -> C07
        'layer-7': 'C08', // Capa 07: Coliseo Cognitivo -> C08
        'layer-8': 'F_MET',// Capa 08: Sensor Sociotécnico
        'layer-9': 'C09'  // Capa 09: Interfaces & MCP -> C09
      };

      const targetKey = clusterMap[layerId] || layerId;
      const targetEl = diagStage.querySelector(`svg g.cluster[id="${targetKey}"]`) || 
                       diagStage.querySelector(`svg .node[id*="${targetKey}"]`) || 
                       diagStage.querySelector(`[id*="${targetKey}"]`);
      const data = NODES_BLUEPRINT_REGISTRY[targetKey];

      if (targetEl && data) {
        focusElementInDiagram(targetEl);
        openNodeInspector(data, targetEl);
        targetEl.classList.remove('is-spotlight');
        void targetEl.offsetWidth;
        targetEl.classList.add('is-spotlight');
      }
    };


      // Disparador de auto-ajuste e inicialización táctica
      const observeMermaidRender = () => {
        let attempts = 0;
        const checkSvg = setInterval(() => {
          attempts++;
          const svg = diagStage.querySelector('svg');
          if (svg && svg.getBoundingClientRect().width > 100) {
            clearInterval(checkSvg);
            fitToViewport();
            if (typeof initNodeInteractivity === 'function') initNodeInteractivity();
            if (typeof renderMinimapSilhouette === 'function') renderMinimapSilhouette();
            if (typeof updateMinimap === 'function') updateMinimap();
            if (typeof initSearch === 'function') initSearch();
          } else if (attempts > 30) {
            clearInterval(checkSvg);
            fitToViewport();
            if (typeof initNodeInteractivity === 'function') initNodeInteractivity();
            if (typeof renderMinimapSilhouette === 'function') renderMinimapSilhouette();
            if (typeof updateMinimap === 'function') updateMinimap();
            if (typeof initSearch === 'function') initSearch();
          }
        }, 150);
      };

      observeMermaidRender();
      window.addEventListener('resize', fitToViewport);
    }

    // Seleccionar por defecto el primer sector
    selectSector('physics');
  });

})();
