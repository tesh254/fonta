import { styled } from 'goober';

export const CardContent = styled('section')`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 100%;
  grid-column-gap: 8px;
  grid-row-gap: 0px;

  @media (max-width: 420px) {
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: 100%;
    grid-column-gap: 8px;
    grid-row-gap: 0px;

    & {
      h3:first-child {
        font-size: 30px !important;
      }

      h3 {
        font-size: 18px !important;
      }
    }
  }
`;
