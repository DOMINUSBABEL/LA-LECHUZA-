import { HistoricalFigure, AgentRole } from './types';

export const HISTORICAL_FIGURES: HistoricalFigure[] = [
  {
    id: 'marcel-abraham',
    name: 'Marcel ABRAHAM',
    bio: 'Figura intelectual francesa de principios del siglo XX, vinculada a redes educativas y culturales.',
    tags: ['Education', 'Culture', 'France']
  },
  {
    id: 'pierre-abraham',
    name: 'Pierre ABRAHAM',
    bio: 'Hermano de Marcel, crítico literario y figura clave en la resistencia intelectual y la edición francesa.',
    tags: ['Literature', 'Resistance', 'Media']
  },
  {
    id: 'louise-alcan',
    name: 'Louise ALCAN',
    bio: 'Promotora cultural y editora, parte de las redes de difusión del pensamiento europeo de entreguerras.',
    tags: ['Publishing', 'Philosophy', 'Networker']
  },
  {
    id: 'jean-amery',
    name: 'Jean AMÉRY (Hans Mayer)',
    bio: 'Nacido Hans Mayer. Ensayista austriaco, luchador de la resistencia y superviviente del Holocausto. Su obra reflexiona sobre la tortura, el resentimiento y la condición de víctima.',
    tags: ['Philosophy', 'Holocaust', 'Existentialism']
  },
  {
    id: 'henri-becker',
    name: 'Henri BECKER',
    bio: 'Intelectual y activista, vinculado a movimientos sociales y artísticos de vanguardia.',
    tags: ['Activism', 'Avant-Garde']
  },
  {
    id: 'paul-eluard',
    name: 'Paul ÉLUARD (Eugène Grindel)',
    bio: 'Poeta francés, uno de los fundadores del surrealismo. Su poesía durante la ocupación nazi, especialmente "Liberté", se convirtió en símbolo de la resistencia.',
    tags: ['Poetry', 'Surrealism', 'Resistance']
  },
  {
    id: 'charles-feld',
    name: 'Charles FELD',
    bio: 'Periodista y escritor, documentalista de la vida cultural parisina y las luchas políticas del siglo XX.',
    tags: ['Journalism', 'History']
  },
  {
    id: 'marie-emilie-reallon',
    name: 'Marie-Émilie RÉALLON',
    bio: '1863-1942. Nacida en Charente-Maritime, maestra de inglés. Viuda en Córcega (1914). Durante la Primera Guerra Mundial, fue enfermera benévola para soldados corsos en París. Autora de "Nouvelles des Blessés Corses". Murió en el olvido y pobreza en 1942. Figura de compromiso humanitario.',
    tags: ['Humanitarian', 'Corsica', 'WWI', 'Women History']
  },
  {
    id: 'hans-hubert-von-ranke',
    name: 'Hans Hubert von RANKE',
    bio: '1902-1978. Nobleza bávara, pionero de Lufthansa, agente secreto del KPD ("Moritz") en los años 30. Jefe de seguridad de las Brigadas Internacionales en España. Rompió con el estalinismo en 1937. Resistencia gaullista en 1942. Periodista en Munich tras la guerra.',
    tags: ['Espionage', 'Spanish Civil War', 'Resistance', 'Anti-Fascist']
  },
  {
    id: 'max-raphael',
    name: 'Max RAPHAEL',
    bio: '1889-1952. Historiador de arte judío-alemán. Teorizó el expresionismo y la sociología del arte marxista ("Teoría empírica del arte"). Enseñó a obreros en Berlín. Exiliado en París y luego NY. Autor de estudios sobre arte paleolítico. Se suicidó en 1952. Influencia en Bourdieu.',
    tags: ['Art History', 'Marxism', 'Education', 'Exile']
  },
  {
    id: 'enrique-thomas-carranza',
    name: 'Enrique Thomas de CARRANZA',
    bio: 'Diplomático y político franquista. Gobernador civil, embajador. Parte de los "siete magníficos" de Alianza Popular. Representa la continuidad de las élites del régimen y la resistencia conservadora a la transición democrática española.',
    tags: ['Politics', 'Diplomacy', 'Transition', 'Right-Wing']
  }
];

export const AGENT_CONFIGS = {
  [AgentRole.G2]: {
    name: 'G2 - Contexto',
    color: 'text-gris-tres-clair', // High contrast
    borderColor: 'border-gris-clair',
    description: 'Investigación histórica, sociología y resonancia cultural.',
    icon: '📚'
  },
  [AgentRole.G3]: {
    name: 'G3 - Difusión',
    color: 'text-bleu-clair', // Accent
    borderColor: 'border-bleu-clair',
    description: 'Estrategia de divulgación, impacto educativo y curaduría.',
    icon: '🏛️'
  },
  [AgentRole.G4]: {
    name: 'G4 - Narrativa',
    color: 'text-gris-bleu', // Soft accent
    borderColor: 'border-gris-bleu',
    description: 'Diseño de artefactos culturales, estética y storytelling.',
    icon: '🖋️'
  },
  [AgentRole.G5]: {
    name: 'G5 - Crítica',
    color: 'text-gris-moyen', // Critical/Serious
    borderColor: 'border-gris-moyen',
    description: 'Integridad histórica, ética de la memoria y revisión académica.',
    icon: '⚖️'
  }
};